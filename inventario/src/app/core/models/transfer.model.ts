import { Id } from './types';

export interface TransferItem {
  productId: Id;
  quantity: number;
}

export interface Transfer {
  id: Id;
  date: string; // ISO
  fromLocationId: Id;
  toLocationId: Id;
  items: TransferItem[];
}
