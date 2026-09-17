import { backend } from '@/mocks/backend';
import { createChatStore } from '../store/chatStore';

describe('offline restart', () => {
  it('keeps pending sends with the same clientIds after a simulated restart', async () => {
    await backend.reset();
    backend.offline = true;

    const store = createChatStore();
    await store.getState().hydrate();

    await store.getState().sendMessage('one');
    await store.getState().sendMessage('two');
    await store.getState().sendMessage('three');

    const before = store.getState().outbox;
    expect(before).toHaveLength(3);
    expect(before.every((entry) => entry.status === 'pending')).toBe(true);
    const clientIds = before.map((entry) => entry.clientId);

    // simulate a force-quit + reopen: a brand new store, same on-disk outbox
    const restarted = createChatStore();
    await restarted.getState().hydrate();

    const after = restarted.getState().outbox;
    expect(after).toHaveLength(3);
    expect(after.map((entry) => entry.clientId)).toEqual(clientIds);
    expect(after.every((entry) => entry.status === 'pending')).toBe(true);
  });
});
