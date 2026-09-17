import { backend } from '@/mocks/backend';
import { createChatStore } from '../store/chatStore';

describe('dedupe', () => {
  it('accepted send + lost response + retry produces exactly one copy in the thread', async () => {
    await backend.reset();

    const store = createChatStore();
    await store.getState().hydrate();

    backend.dropNextResponse = true;
    await store.getState().sendMessage('hello');

    // response never arrived, but the server already accepted this clientId —
    // the message goes back to "pending" for a retry, not "failed"
    const afterFirstAttempt = store.getState().outbox;
    expect(afterFirstAttempt).toHaveLength(1);
    expect(afterFirstAttempt[0].status).toBe('pending');
    expect(afterFirstAttempt[0].error?.code).toBe('RESPONSE_LOST');
    expect(store.getState().thread).toHaveLength(0);

    // retry with the same clientId — backend recognizes it as already accepted
    await store.getState().drainOutbox();

    expect(store.getState().outbox).toHaveLength(0);
    expect(store.getState().thread).toHaveLength(1);
    expect(store.getState().thread[0].text).toBe('hello');

    // and the server itself never allocated a second message for this clientId —
    // only the one seeded history block (50k) plus this single send exists
    const serverMessages = await backend.since(50_000);
    expect(serverMessages).toHaveLength(1);
  });
});
