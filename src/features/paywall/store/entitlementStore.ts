import { create } from 'zustand';
import { purchaseStore } from '@/mocks/purchases';
import { purchaseRepo } from '../data/purchaseRepo';
import type { Entitlement, Purchase, PurchaseState } from '../types';

type EntitlementState = {
  entitlement: Entitlement;
  purchase: Purchase | null;
  status: PurchaseState;
  confirming: Promise<void> | null;
  confirmedReceipts: Set<string>;
  hydrate: () => Promise<void>;
  buy: (productId: string) => Promise<void>;
};

export function createEntitlementStore() {
  return create<EntitlementState>((set, get) => {
    async function confirmReceipt(receiptId: string): Promise<void> {
      if (get().confirmedReceipts.has(receiptId)) return; // dedupe repeated confirmation events

      const result = await purchaseStore.confirmEntitlement(receiptId);

      const active: Entitlement = { status: 'active', receiptId, confirmedAt: result.confirmedAt };
      set((state) => ({
        entitlement: active,
        confirmedReceipts: new Set(state.confirmedReceipts).add(receiptId),
      }));
      await purchaseRepo.saveEntitlement(active);
    }

    return {
      entitlement: { status: 'none' },
      purchase: null,
      status: 'idle',
      confirming: null,
      confirmedReceipts: new Set(),

      hydrate: async () => {
        const entitlement = await purchaseRepo.loadEntitlement();
        set({ entitlement });
      },

      // TODO: restore-purchases flow (Phase 4) — re-checks an existing
      // receipt against the mock backend without a new purchase() call.

      buy: async (productId: string) => {
        if (get().status === 'purchasing') return; // guard double-taps

        set({ status: 'purchasing' });

        const purchase = await purchaseStore.purchase(productId);
        set({ purchase, status: purchase.state });

        if (purchase.state !== 'succeeded') return; // failed/cancelled attempt leaves any existing entitlement untouched

        const pending: Entitlement = { status: 'pending', receiptId: purchase.receiptId };
        set({ entitlement: pending });
        await purchaseRepo.saveEntitlement(pending);

        // buy() resolves once the purchase itself settles; confirmation keeps
        // running in the background so callers can observe "pending" in between
        set({ confirming: confirmReceipt(purchase.receiptId) });
      },
    };
  });
}

export const useEntitlementStore = createEntitlementStore();
