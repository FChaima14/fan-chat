import { kv } from '@/shared/storage/kv';
import type { ServerMessage } from '@/mocks/backend';

const THREAD_KEY = 'thread';
const LAST_SEQ_KEY = 'lastSeq';

async function load(): Promise<ServerMessage[]> {
  return (await kv.getItem<ServerMessage[]>(THREAD_KEY)) ?? [];
}

async function save(messages: ServerMessage[]): Promise<void> {
  await kv.setItem(THREAD_KEY, messages);
}

// Merges by clientId so a dedupe replay (same clientId, same seq) never adds
// a second row — this is where the duplicate-message bug would resurface.
async function merge(incoming: ServerMessage[]): Promise<ServerMessage[]> {
  const existing = await load();
  const byClientId = new Map(existing.map((message) => [message.clientId, message]));
  for (const message of incoming) byClientId.set(message.clientId, message);
  const merged = [...byClientId.values()].sort((a, b) => a.seq - b.seq);
  await save(merged);
  return merged;
}

async function loadLastSeq(): Promise<number> {
  return (await kv.getItem<number>(LAST_SEQ_KEY)) ?? 0;
}

async function saveLastSeq(seq: number): Promise<void> {
  await kv.setItem(LAST_SEQ_KEY, seq);
}

export const threadRepo = { load, save, merge, loadLastSeq, saveLastSeq };
