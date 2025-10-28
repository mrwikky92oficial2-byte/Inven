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
  selector: 'app-transfers',
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
      <h2>Transferencias</h2>
      <button mat-flat-button color="primary" (click)="openDialog()">
        <mat-icon>add</mat-icon>
        Nueva transferencia
      </button>
    </div>

    <table mat-table [dataSource]="svc.transfers()" class="mat-elevation-z1 full">
      <ng-container matColumnDef="date">
        <th mat-header-cell *matHeaderCellDef>Fecha</th>
        <td mat-cell *matCellDef="let t">{{ t.date | date:'short' }}</td>
      </ng-container>
      <ng-container matColumnDef="from">
        <th mat-header-cell *matHeaderCellDef>Desde</th>
        <td mat-cell *matCellDef="let t">{{ locationName(t.fromLocationId) }}</td>
      </ng-container>
      <ng-container matColumnDef="to">
        <th mat-header-cell *matHeaderCellDef>Hacia</th>
        <td mat-cell *matCellDef="let t">{{ locationName(t.toLocationId) }}</td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: [`.full{width:100%}.header{display:flex;align-items:center;gap:12px;margin-bottom:12px}`]
})
export class TransfersPage {
  svc = inject(InventoryService);
  displayedColumns = ['date','from','to'];
  private dialog = inject(MatDialog);

  locationName(id: string) {
    return this.svc.locations().find(l => l.id === id)?.name || '-';
  }

  openDialog() {
    this.dialog.open(TransferDialog, { width: '720px' });
  }
}

@Component({
  selector: 'app-transfer-dialog',
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
    <h2 mat-dialog-title>Nueva transferencia</h2>
    <div mat-dialog-content>
      <div class="row">
        <mat-form-field appearance="outline" class="w100">
          <mat-label>Desde</mat-label>
          <mat-select [(ngModel)]="fromLocationId">
            <mat-option *ngFor="let l of svc.locations()" [value]="l.id">{{ l.name }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="w100">
          <mat-label>Hacia</mat-label>
          <mat-select [(ngModel)]="toLocationId">
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
          <button mat-icon-button color="warn" (click)="removeItem(i)"><mat-icon>delete</mat-icon></button>
        </div>
      </div>
      <button mat-stroked-button (click)="addItem()"><mat-icon>add</mat-icon>Agregar producto</button>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="!fromLocationId || !toLocationId || !items.length || fromLocationId===toLocationId">Guardar</button>
    </div>
  `,
  styles: [`.w100{width:100%}.row{display:grid;grid-template-columns:1fr 1fr;gap:12px}.items{display:flex;flex-direction:column;gap:8px;margin-top:8px}.item{display:grid;grid-template-columns:2fr 1fr auto;gap:8px}`]
})
export class TransferDialog {
  svc = inject(InventoryService);
  dialogRef = inject(MatDialogRef<TransferDialog>);
  fromLocationId = '';
  toLocationId = '';
  items: { productId: string; quantity: number }[] = [];

  addItem() { this.items.push({ productId: '', quantity: 1 }); }
  removeItem(i: number) { this.items.splice(i, 1); }

  save() {
    const date = new Date().toISOString();
    this.svc.createTransfer({ date, fromLocationId: this.fromLocationId, toLocationId: this.toLocationId, items: this.items });
    this.dialogRef.close();
  }
}
