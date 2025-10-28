import { Id } from './types';

export interface StockRecord {
  productId: Id;
  locationId: Id;
  quantity: number;
}
