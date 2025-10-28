import { Id } from './types';

export interface PurchaseItem {
  productId: Id;
  quantity: number;
  unitCost: number;
  locationId: Id;
}

export interface Purchase {
  id: Id;
  supplierId: Id;
  date: string; // ISO string
  items: PurchaseItem[];
  total: number;
}
