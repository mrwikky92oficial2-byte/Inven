import { Id } from './types';

export interface Supplier {
  id: Id;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}
