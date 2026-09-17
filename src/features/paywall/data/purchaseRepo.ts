import { kv } from '@/shared/storage/kv';
import type { Entitlement } from '../types';

const ENTITLEMENT_KEY = 'entitlement';

async function loadEntitlement(): Promise<Entitlement> {
  return (await kv.getItem<Entitlement>(ENTITLEMENT_KEY)) ?? { status: 'none' };
}

async function saveEntitlement(entitlement: Entitlement): Promise<void> {
  await kv.setItem(ENTITLEMENT_KEY, entitlement);
}

export const purchaseRepo = { loadEntitlement, saveEntitlement };
