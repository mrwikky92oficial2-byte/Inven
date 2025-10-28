import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../core/services/inventory.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
  ],
  template: `
    <div class="header">
      <h2>Ventas</h2>
      <button mat-flat-button color="primary" (click)="openDialog()">
        <mat-icon>add</mat-icon>
        Nueva venta
      </button>
    </div>

    <table mat-table [dataSource]="svc.sales()" class="mat-elevation-z1 full">
      <ng-container matColumnDef="date">
        <th mat-header-cell *matHeaderCellDef>Fecha</th>
        <td mat-cell *matCellDef="let s">{{ s.date | date:'short' }}</td>
      </ng-container>
      <ng-container matColumnDef="location">
        <th mat-header-cell *matHeaderCellDef>Ubicación</th>
        <td mat-cell *matCellDef="let s">{{ locationName(s.locationId) }}</td>
      </ng-container>
      <ng-container matColumnDef="total">
        <th mat-header-cell *matHeaderCellDef>Total</th>
        <td mat-cell *matCellDef="let s">{{ s.total | currency }}</td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: [`.full{width:100%}.header{display:flex;align-items:center;gap:12px;margin-bottom:12px}`]
})
export class SalesPage {
  svc = inject(InventoryService);
  displayedColumns = ['date','location','total'];
  private dialog = inject(MatDialog);

  locationName(id: string) {
    return this.svc.locations().find(l => l.id === id)?.name || '-';
  }

  openDialog() {
    this.dialog.open(SaleDialog, { width: '720px' });
  }
}

@Component({
  selector: 'app-sale-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>Nueva venta</h2>
    <div mat-dialog-content>
      <div class="row">
        <mat-form-field appearance="outline" class="w100">
          <mat-label>Ubicación</mat-label>
          <mat-select [(ngModel)]="locationId">
            <mat-option *ngFor="let l of svc.locations()" [value]="l.id">{{ l.name }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="items">
        <div class="item" *ngFor="let it of items; let i = index">
          <mat-form-field appearance="outline">
            <mat-label>Producto</mat-label>
            <mat-select [(ngModel)]="items[i].productId">
              <mat-option *ngFor="let p of svc.products()" [value]="p.id">{{ p.name }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Cantidad</mat-label>
            <input matInput type="number" [(ngModel)]="items[i].quantity" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Precio unitario</mat-label>
            <input matInput type="number" [(ngModel)]="items[i].unitPrice" />
          </mat-form-field>
          <button mat-icon-button color="warn" (click)="removeItem(i)"><mat-icon>delete</mat-icon></button>
        </div>
      </div>
      <button mat-stroked-button (click)="addItem()"><mat-icon>add</mat-icon>Agregar producto</button>
    </div>
    <div mat-dialog-actions align="end">
      <div class="spacer"></div>
      <div>Total: {{ total() | currency }}</div>
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="!locationId || !items.length">Guardar</button>
    </div>
  `,
  styles: [`.w100{width:100%}.row{display:grid;grid-template-columns:1fr;gap:12px}.items{display:flex;flex-direction:column;gap:8px;margin-top:8px}.item{display:grid;grid-template-columns:2fr 1fr 1fr auto;gap:8px}.spacer{flex:1}`]
})
export class SaleDialog {
  svc = inject(InventoryService);
  dialogRef = inject(MatDialogRef<SaleDialog>);
  locationId = '';
  items: { productId: string; quantity: number; unitPrice: number }[] = [];

  addItem() { this.items.push({ productId: '', quantity: 1, unitPrice: 0 }); }
  removeItem(i: number) { this.items.splice(i, 1); }
  total() { return this.items.reduce((s,i)=> s + (i.quantity||0) * (i.unitPrice||0), 0); }

  save() {
    const date = new Date().toISOString();
    this.svc.createSale({ date, locationId: this.locationId, items: this.items });
    this.dialogRef.close();
  }
}
