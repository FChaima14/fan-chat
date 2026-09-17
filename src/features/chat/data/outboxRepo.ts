import { kv } from '@/shared/storage/kv';
import type { Outgoing } from '../types';

const OUTBOX_KEY = 'outbox';

async function load(): Promise<Outgoing[]> {
  return (await kv.getItem<Outgoing[]>(OUTBOX_KEY)) ?? [];
}

async function save(entries: Outgoing[]): Promise<void> {
  await kv.setItem(OUTBOX_KEY, entries);
}

async function add(entry: Outgoing): Promise<void> {
  const entries = await load();
  await save([...entries, entry]);
}

async function update(clientId: string, patch: Partial<Outgoing>): Promise<void> {
  const entries = await load();
  await save(entries.map((entry) => (entry.clientId === clientId ? { ...entry, ...patch } : entry)));
}

async function remove(clientId: string): Promise<void> {
  const entries = await load();
  await save(entries.filter((entry) => entry.clientId !== clientId));
}

export const outboxRepo = { load, add, update, remove };
