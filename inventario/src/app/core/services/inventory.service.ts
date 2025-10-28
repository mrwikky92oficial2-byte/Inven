import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { Location } from '../models/location.model';
import { Supplier } from '../models/supplier.model';
import { StockRecord } from '../models/inventory.model';
import { Purchase } from '../models/purchase.model';
import { Sale } from '../models/sale.model';
import { Transfer } from '../models/transfer.model';
import { StorageUtil } from '../utils/storage';

function genId(prefix: string = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
  products = signal<Product[]>(StorageUtil.get<Product[]>('inv_products', []));
  locations = signal<Location[]>(StorageUtil.get<Location[]>('inv_locations', []));
  suppliers = signal<Supplier[]>(StorageUtil.get<Supplier[]>('inv_suppliers', []));
  stock = signal<StockRecord[]>(StorageUtil.get<StockRecord[]>('inv_stock', []));
  purchases = signal<Purchase[]>(StorageUtil.get<Purchase[]>('inv_purchases', []));
  sales = signal<Sale[]>(StorageUtil.get<Sale[]>('inv_sales', []));
  transfers = signal<Transfer[]>(StorageUtil.get<Transfer[]>('inv_transfers', []));

  private persist() {
    StorageUtil.set('inv_products', this.products());
    StorageUtil.set('inv_locations', this.locations());
    StorageUtil.set('inv_suppliers', this.suppliers());
    StorageUtil.set('inv_stock', this.stock());
    StorageUtil.set('inv_purchases', this.purchases());
    StorageUtil.set('inv_sales', this.sales());
    StorageUtil.set('inv_transfers', this.transfers());
  }

  // Products
  addProduct(product: Omit<Product, 'id'>) {
    const p: Product = { id: genId('prod'), ...product };
    this.products.update(list => [...list, p]);
    this.persist();
    return p;
  }
  updateProduct(updated: Product) {
    this.products.update(list => list.map(p => p.id === updated.id ? updated : p));
    this.persist();
  }
  removeProduct(id: string) {
    this.products.update(list => list.filter(p => p.id !== id));
    // remove stock records for this product
    this.stock.update(list => list.filter(s => s.productId !== id));
    this.persist();
  }

  // Locations
  addLocation(location: Omit<Location, 'id'>) {
    const l: Location = { id: genId('loc'), ...location };
    this.locations.update(list => [...list, l]);
    this.persist();
    return l;
  }
  updateLocation(updated: Location) {
    this.locations.update(list => list.map(l => l.id === updated.id ? updated : l));
    this.persist();
  }
  removeLocation(id: string) {
    this.locations.update(list => list.filter(l => l.id !== id));
    this.stock.update(list => list.filter(s => s.locationId !== id));
    this.persist();
  }

  // Suppliers
  addSupplier(supplier: Omit<Supplier, 'id'>) {
    const s: Supplier = { id: genId('sup'), ...supplier };
    this.suppliers.update(list => [...list, s]);
    this.persist();
    return s;
  }
  updateSupplier(updated: Supplier) {
    this.suppliers.update(list => list.map(s => s.id === updated.id ? updated : s));
    this.persist();
  }
  removeSupplier(id: string) {
    this.suppliers.update(list => list.filter(s => s.id !== id));
    this.persist();
  }

  // Stock helpers
  private getStock(productId: string, locationId: string): number {
    const rec = this.stock().find(s => s.productId === productId && s.locationId === locationId);
    return rec?.quantity ?? 0;
  }
  private setStock(productId: string, locationId: string, quantity: number) {
    const list = this.stock();
    const idx = list.findIndex(s => s.productId === productId && s.locationId === locationId);
    if (idx >= 0) {
      list[idx] = { ...list[idx], quantity };
    } else {
      list.push({ productId, locationId, quantity });
    }
    this.stock.set([...list]);
  }

  // Purchases (increase stock)
  createPurchase(purchase: Omit<Purchase, 'id' | 'total'>) {
    const total = purchase.items.reduce((sum, i) => sum + i.quantity * i.unitCost, 0);
    const full: Purchase = { id: genId('pur'), total, ...purchase };
    this.purchases.update(list => [full, ...list]);
    for (const item of purchase.items) {
      const current = this.getStock(item.productId, item.locationId);
      this.setStock(item.productId, item.locationId, current + item.quantity);
    }
    this.persist();
    return full;
  }

  // Sales (decrease stock)
  createSale(sale: Omit<Sale, 'id' | 'total'>) {
    const total = sale.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
    const full: Sale = { id: genId('sale'), total, ...sale };
    this.sales.update(list => [full, ...list]);
    for (const item of sale.items) {
      const current = this.getStock(item.productId, sale.locationId);
      this.setStock(item.productId, sale.locationId, current - item.quantity);
    }
    this.persist();
    return full;
  }

  // Transfers (move stock between locations)
  createTransfer(t: Omit<Transfer, 'id'>) {
    const full: Transfer = { id: genId('trn'), ...t };
    this.transfers.update(list => [full, ...list]);
    for (const item of t.items) {
      const fromQty = this.getStock(item.productId, t.fromLocationId);
      const toQty = this.getStock(item.productId, t.toLocationId);
      this.setStock(item.productId, t.fromLocationId, fromQty - item.quantity);
      this.setStock(item.productId, t.toLocationId, toQty + item.quantity);
    }
    this.persist();
    return full;
  }
}
