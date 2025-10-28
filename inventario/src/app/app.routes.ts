import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'productos' },
      { path: 'productos', loadComponent: () => import('./features/products/products.page').then(m => m.ProductsPage) },
      { path: 'ubicaciones', loadComponent: () => import('./features/locations/locations.page').then(m => m.LocationsPage) },
      { path: 'proveedores', loadComponent: () => import('./features/suppliers/suppliers.page').then(m => m.SuppliersPage) },
      { path: 'compras', loadComponent: () => import('./features/purchases/purchases.page').then(m => m.PurchasesPage) },
      { path: 'transferencias', loadComponent: () => import('./features/transfers/transfers.page').then(m => m.TransfersPage) },
      { path: 'ventas', loadComponent: () => import('./features/sales/sales.page').then(m => m.SalesPage) },
      { path: 'reportes', loadComponent: () => import('./features/reports/reports.page').then(m => m.ReportsPage) },
    ]
  },
  { path: '**', redirectTo: '' }
];
