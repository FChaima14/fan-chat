import Storage from 'expo-sqlite/kv-store';

// expo-sqlite/kv-store is AsyncStorage-shaped (string in, string out, all async).
// That's why outbox writes have to be awaited before we touch the store — there's
// no synchronous path here the way MMKV would give us. See README for the tradeoff.

async function getItem<T>(key: string): Promise<T | null> {
  const raw = await Storage.getItem(key);
  if (raw === null) return null;
  return JSON.parse(raw) as T;
}

async function setItem<T>(key: string, value: T): Promise<void> {
  await Storage.setItem(key, JSON.stringify(value));
}

async function removeItem(key: string): Promise<void> {
  await Storage.removeItem(key);
}

export const kv = { getItem, setItem, removeItem };
