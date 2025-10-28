import { Id } from './types';

export interface SaleItem {
  productId: Id;
  quantity: number;
  unitPrice: number;
}

export interface Sale {
  id: Id;
  date: string; // ISO
  locationId: Id;
  items: SaleItem[];
  total: number;
}
