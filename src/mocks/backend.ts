import { kv } from '@/shared/storage/kv';
import { mulberry32 } from '@/shared/utils/prng';
import { uuidv4 } from '@/shared/utils/id';

export type MessageAuthor = 'me' | 'them';

export type ServerMessage = {
  clientId: string;
  seq: number;
  author: MessageAuthor;
  text: string;
  createdAt: number;
};

export type BackendErrorCode = 'NETWORK_UNAVAILABLE' | 'RESPONSE_LOST';

export class BackendError extends Error {
  code: BackendErrorCode;
  recoverable: boolean;
  constructor(code: BackendErrorCode, recoverable: boolean) {
    super(code);
    this.code = code;
    this.recoverable = recoverable;
  }
}

const SEED_HISTORY_SIZE = 50_000;
const SEED = 1337;
const ACCEPTED_KEY = 'backend.accepted';
const LOG_KEY = 'backend.log';

const SAMPLE_LINES = [
  'Hey! Just posted a new set, check it out 📸',
  'Thanks so much for subscribing!',
  'When are you going live next?',
  'Loved that last post 😍',
  'Working on something new this week',
  'Can you do a shoutout?',
  'Sure thing, give me a sec',
  'That means a lot, thank you',
  'What time zone are you in?',
  'Just dropped a discount code for subscribers',
  'How long have you been doing this?',
  'Any plans for the holidays?',
  'Thanks for the support as always',
  'Question about my last order',
  'On it, one moment',
  'This community is the best',
  'Can you post more behind the scenes stuff?',
  'Absolutely, stay tuned',
  'Happy Friday everyone',
  'Really appreciate you being here',
];

// Regenerated deterministically every boot instead of persisted — mulberry32
// with a fixed seed already guarantees it's byte-identical, so there's nothing
// to gain from writing 50k rows to disk.
function generateSeedHistory(): ServerMessage[] {
  const random = mulberry32(SEED);
  const messages: ServerMessage[] = [];
  let createdAt = Date.UTC(2023, 0, 1);
  for (let i = 0; i < SEED_HISTORY_SIZE; i++) {
    createdAt += 1000 + Math.floor(random() * 60_000);
    messages.push({
      clientId: `seed-${i}`,
      seq: i + 1,
      author: random() < 0.5 ? 'me' : 'them',
      text: SAMPLE_LINES[Math.floor(random() * SAMPLE_LINES.length)],
      createdAt,
    });
  }
  return messages;
}

export class MockBackend {
  offline = false;
  dropNextResponse = false;

  private seed: ServerMessage[] = [];
  private extra: ServerMessage[] = [];
  private accepted = new Map<string, ServerMessage>();
  readonly ready: Promise<void>;

  constructor() {
    this.ready = this.hydrate();
  }

  private async hydrate() {
    this.seed = generateSeedHistory();
    const persistedLog = (await kv.getItem<ServerMessage[]>(LOG_KEY)) ?? [];
    const persistedAccepted = (await kv.getItem<Record<string, ServerMessage>>(ACCEPTED_KEY)) ?? {};
    this.extra = persistedLog;
    this.accepted = new Map(Object.entries(persistedAccepted));
    for (const message of this.seed) {
      if (!this.accepted.has(message.clientId)) this.accepted.set(message.clientId, message);
    }
  }

  private get cursor() {
    return this.seed.length + this.extra.length;
  }

  private async persist() {
    await kv.setItem(LOG_KEY, this.extra);
    await kv.setItem(ACCEPTED_KEY, Object.fromEntries(this.accepted));
  }

  async send(clientId: string, text: string): Promise<ServerMessage> {
    await this.ready;

    if (this.offline) {
      throw new BackendError('NETWORK_UNAVAILABLE', true);
    }

    const existing = this.accepted.get(clientId);
    if (existing) {
      return existing;
    }

    const message: ServerMessage = {
      clientId,
      seq: this.cursor + 1,
      author: 'me',
      text,
      createdAt: Date.now(),
    };
    this.extra.push(message);
    this.accepted.set(clientId, message);
    await this.persist();

    if (this.dropNextResponse) {
      this.dropNextResponse = false;
      // server truth is already updated above — only the ack back to the client is lost
      throw new BackendError('RESPONSE_LOST', true);
    }

    return message;
  }

  async since(seq: number): Promise<ServerMessage[]> {
    await this.ready;
    return [...this.seed, ...this.extra].filter((m) => m.seq > seq).sort((a, b) => a.seq - b.seq);
  }

  async page(beforeSeq: number, limit: number): Promise<ServerMessage[]> {
    await this.ready;
    return [...this.seed, ...this.extra]
      .filter((m) => m.seq < beforeSeq)
      .sort((a, b) => b.seq - a.seq)
      .slice(0, limit)
      .sort((a, b) => a.seq - b.seq);
  }

  async injectIncoming(n: number): Promise<ServerMessage[]> {
    await this.ready;
    const injected: ServerMessage[] = [];
    for (let i = 0; i < n; i++) {
      const message: ServerMessage = {
        clientId: uuidv4(),
        seq: this.cursor + 1,
        author: 'them',
        text: SAMPLE_LINES[Math.floor(Math.random() * SAMPLE_LINES.length)],
        createdAt: Date.now(),
      };
      this.extra.push(message);
      this.accepted.set(message.clientId, message);
      injected.push(message);
    }
    await this.persist();
    return injected;
  }

  async reset(): Promise<void> {
    await this.ready;
    this.extra = [];
    this.accepted = new Map(this.seed.map((m) => [m.clientId, m]));
    this.offline = false;
    this.dropNextResponse = false;
    await kv.removeItem(LOG_KEY);
    await kv.removeItem(ACCEPTED_KEY);
  }
}

export const backend = new MockBackend();
