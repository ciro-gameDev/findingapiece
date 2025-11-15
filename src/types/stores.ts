/**
 * Store type definitions
 */

export interface StoreItem {
  itemId: string;
  price: number;
  stock?: number; // Optional stock limit (undefined = unlimited)
}

export interface Store {
  id: string;
  name: string;
  items: StoreItem[];
  isGeneralStore?: boolean; // If true, accepts any item for selling
}

