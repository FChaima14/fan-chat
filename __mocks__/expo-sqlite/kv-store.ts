// Manual mock so tests exercise the same AsyncStorage-shaped API as the real
// expo-sqlite/kv-store, backed by an in-memory Map instead of native SQLite.
// The Map lives for the lifetime of the test file, which is what lets
// "simulated restart" tests create a fresh store while keeping the same disk.
const disk = new Map<string, string>();

async function getItem(key: string): Promise<string | null> {
  return disk.has(key) ? disk.get(key)! : null;
}

async function setItem(key: string, value: string): Promise<void> {
  disk.set(key, value);
}

async function removeItem(key: string): Promise<void> {
  disk.delete(key);
}

export default { getItem, setItem, removeItem };
