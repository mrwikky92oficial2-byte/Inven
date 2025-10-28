import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../core/services/inventory.service';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  template: `
    <h2>Reportes</h2>
    <div class="grid">
      <mat-card>
        <mat-card-title>Ventas (últimos 30 días)</mat-card-title>
        <mat-card-content>
          <table mat-table [dataSource]="salesRecent()" class="full">
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Fecha</th>
              <td mat-cell *matCellDef="let s">{{ s.date | date:'shortDate' }}</td>
            </ng-container>
            <ng-container matColumnDef="total">
              <th mat-header-cell *matHeaderCellDef>Total</th>
              <td mat-cell *matCellDef="let s">{{ s.total | currency }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="['date','total']"></tr>
            <tr mat-row *matRowDef="let row; columns: ['date','total']"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-title>Productos con bajo stock</mat-card-title>
        <mat-card-content>
          <table mat-table [dataSource]="lowStock()" class="full">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Producto</th>
              <td mat-cell *matCellDef="let r">{{ r.name }}</td>
            </ng-container>
            <ng-container matColumnDef="location">
              <th mat-header-cell *matHeaderCellDef>Ubicación</th>
              <td mat-cell *matCellDef="let r">{{ r.location }}</td>
            </ng-container>
            <ng-container matColumnDef="qty">
              <th mat-header-cell *matHeaderCellDef>Cantidad</th>
              <td mat-cell *matCellDef="let r">{{ r.qty }}</td>
            </ng-container>
            <ng-container matColumnDef="min">
              <th mat-header-cell *matHeaderCellDef>Mínimo</th>
              <td mat-cell *matCellDef="let r">{{ r.min }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="['name','location','qty','min']"></tr>
            <tr mat-row *matRowDef="let row; columns: ['name','location','qty','min']"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`.grid{display:grid;grid-template-columns:1fr;gap:16px}.full{width:100%}`]
})
export class ReportsPage {
  svc = inject(InventoryService);

  salesRecent = computed(() => {
    const cutoff = Date.now() - 30*24*60*60*1000;
    return this.svc.sales().filter(s => new Date(s.date).getTime() >= cutoff);
  });

  lowStock = computed(() => {
    const rows: { name: string; location: string; qty: number; min: number }[] = [];
    for (const p of this.svc.products()) {
      for (const l of this.svc.locations()) {
        const qty = this.svc['stock']().find((s:any)=> s.productId===p.id && s.locationId===l.id)?.quantity ?? 0;
        if (qty < p.minStock) {
          rows.push({ name: p.name, location: l.name, qty, min: p.minStock });
        }
      }
    }
    return rows;
  });
}
