import { sleep } from '@/shared/utils/sleep';
import { uuidv4 } from '@/shared/utils/id';
import type { Purchase, PurchaseState } from '@/features/paywall/types';

// Failure injection for the paywall, same idea as mocks/backend.ts for chat.
export type NextPurchaseResult = Extract<PurchaseState, 'succeeded' | 'cancelled' | 'failed'>;

const CONFIRM_DELAY_MS = 800;

export class MockPurchaseStore {
  nextResult: NextPurchaseResult = 'succeeded';

  async purchase(productId: string): Promise<Purchase> {
    await sleep(50); // pretend to round-trip to the platform store

    return {
      receiptId: uuidv4(),
      productId,
      purchasedAt: Date.now(),
      state: this.nextResult,
    };
  }

  // Simulates the mock backend confirming a receipt — entitlement is only
  // ever granted here, never by the purchase result itself.
  async confirmEntitlement(receiptId: string): Promise<{ receiptId: string; confirmedAt: number }> {
    await sleep(CONFIRM_DELAY_MS);
    return { receiptId, confirmedAt: Date.now() };
  }

  reset(): void {
    this.nextResult = 'succeeded';
  }
}

export const purchaseStore = new MockPurchaseStore();
