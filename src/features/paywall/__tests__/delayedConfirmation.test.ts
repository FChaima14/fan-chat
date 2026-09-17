import { purchaseStore } from '@/mocks/purchases';
import { createEntitlementStore } from '../store/entitlementStore';

describe('delayed confirmation', () => {
  it('grants no access until the backend confirms, then grants access', async () => {
    purchaseStore.reset();

    const store = createEntitlementStore();
    await store.getState().hydrate();

    expect(store.getState().entitlement.status).toBe('none');

    await store.getState().buy('sub_monthly');

    expect(store.getState().entitlement.status).toBe('pending');

    await store.getState().confirming;

    expect(store.getState().entitlement.status).toBe('active');
    expect(store.getState().entitlement.receiptId).toBe(store.getState().purchase?.receiptId);
  });
});
