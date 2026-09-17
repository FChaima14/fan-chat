export type PurchaseState = 'idle' | 'purchasing' | 'succeeded' | 'cancelled' | 'failed';

// What the mock store returns — separate from entitlement, which is what the
// mock backend confirms after a delay. Never collapse the two.
export type Purchase = {
  receiptId: string;
  productId: string;
  purchasedAt: number;
  state: PurchaseState;
};

export type EntitlementStatus = 'none' | 'pending' | 'active';

export type Entitlement = {
  status: EntitlementStatus;
  receiptId?: string;
  confirmedAt?: number;
};
