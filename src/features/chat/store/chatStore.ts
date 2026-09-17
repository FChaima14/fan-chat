import { create } from 'zustand';
import { backend, BackendError, type ServerMessage } from '@/mocks/backend';
import { uuidv4 } from '@/shared/utils/id';
import { outboxRepo } from '../data/outboxRepo';
import { threadRepo } from '../data/threadRepo';
import type { Outgoing } from '../types';

type ChatState = {
  outbox: Outgoing[];
  thread: ServerMessage[];
  lastSeq: number;
  draining: boolean;
  hydrate: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  drainOutbox: () => Promise<void>;
  reconnect: () => Promise<void>;
};

export function createChatStore() {
  return create<ChatState>((set, get) => {
    // Returns true when the attempt failed for a recoverable (offline-shaped)
    // reason, so the drain loop knows to stop instead of burning through the
    // rest of the queue with the same failure.
    async function attemptSend(clientId: string): Promise<boolean> {
      const message = get().outbox.find((entry) => entry.clientId === clientId);
      if (!message) return false;

      await outboxRepo.update(clientId, { status: 'sending' });
      set((state) => ({
        outbox: state.outbox.map((entry) =>
          entry.clientId === clientId ? { ...entry, status: 'sending' } : entry,
        ),
      }));

      try {
        const confirmed = await backend.send(clientId, message.text);
        const thread = await threadRepo.merge([confirmed]);
        const lastSeq = Math.max(get().lastSeq, confirmed.seq);
        await threadRepo.saveLastSeq(lastSeq);
        await outboxRepo.remove(clientId);
        set((state) => ({
          thread,
          lastSeq,
          outbox: state.outbox.filter((entry) => entry.clientId !== clientId),
        }));
        return false;
      } catch (err) {
        if (!(err instanceof BackendError)) throw err;
        const { code, recoverable } = err;

        const attempts = message.attempts + 1;
        // recoverable failures go back to "pending" so the drain loop retries
        // them; non-recoverable ones stay "failed" with no retry
        const status: Outgoing['status'] = recoverable ? 'pending' : 'failed';
        const patch = { status, attempts, error: { code, recoverable } };

        await outboxRepo.update(clientId, patch);
        set((state) => ({
          outbox: state.outbox.map((entry) => (entry.clientId === clientId ? { ...entry, ...patch } : entry)),
        }));
        return recoverable;
      }
    }

    return {
      outbox: [],
      thread: [],
      lastSeq: 0,
      draining: false,

      hydrate: async () => {
        const [outbox, thread, lastSeq] = await Promise.all([
          outboxRepo.load(),
          threadRepo.load(),
          threadRepo.loadLastSeq(),
        ]);
        set({ outbox, thread, lastSeq });
      },

      sendMessage: async (text: string) => {
        const message: Outgoing = {
          clientId: uuidv4(),
          text,
          createdAt: Date.now(),
          status: 'pending',
          attempts: 0,
        };

        // must hit disk before the store ever claims the message is queued
        await outboxRepo.add(message);
        set((state) => ({ outbox: [...state.outbox, message] }));

        await attemptSend(message.clientId);
      },

      drainOutbox: async () => {
        if (get().draining) return;
        set({ draining: true });
        try {
          const queue = [...get().outbox]
            .filter((entry) => entry.status === 'pending')
            .sort((a, b) => a.createdAt - b.createdAt);

          for (const entry of queue) {
            const stoppedByDisconnect = await attemptSend(entry.clientId);
            if (stoppedByDisconnect) break;
          }
          // TODO: exponential backoff between retries, and a connectivity
          // listener to call this automatically on reconnect — that timing
          // belongs in useOutboxDrain (Phase 3), not in the store itself.
        } finally {
          set({ draining: false });
        }
      },

      reconnect: async () => {
        const incoming = await backend.since(get().lastSeq);
        if (incoming.length > 0) {
          const merged = await threadRepo.merge(incoming);
          const lastSeq = merged.reduce((max, message) => Math.max(max, message.seq), get().lastSeq);
          await threadRepo.saveLastSeq(lastSeq);
          set({ thread: merged, lastSeq });
        }
        await get().drainOutbox();
      },
    };
  });
}

export const useChatStore = createChatStore();
