import { Id } from './types';

export interface Product {
  id: Id;
  name: string;
  category: string;
  sku?: string;
  minStock: number;
  maxStock: number;
  purchasePrice: number;
  salePrice: number;
  active?: boolean;
}
