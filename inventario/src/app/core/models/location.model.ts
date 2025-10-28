import { Id } from './types';

export type LocationType = 'store' | 'warehouse';

export interface Location {
  id: Id;
  name: string;
  type: LocationType;
}
