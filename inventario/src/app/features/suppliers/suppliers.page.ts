import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../core/services/inventory.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Supplier } from '../../core/models/supplier.model';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  template: `
    <div class="header">
      <h2>Proveedores</h2>
      <button mat-flat-button color="primary" (click)="openDialog()">
        <mat-icon>add</mat-icon>
        Agregar
      </button>
    </div>

    <table mat-table [dataSource]="svc.suppliers()" class="mat-elevation-z1 full">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Nombre</th>
        <td mat-cell *matCellDef="let s">{{ s.name }}</td>
      </ng-container>
      <ng-container matColumnDef="phone">
        <th mat-header-cell *matHeaderCellDef>Teléfono</th>
        <td mat-cell *matCellDef="let s">{{ s.phone }}</td>
      </ng-container>
      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef>Email</th>
        <td mat-cell *matCellDef="let s">{{ s.email }}</td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let s">
          <button mat-icon-button color="primary" (click)="openDialog(s)"><mat-icon>edit</mat-icon></button>
          <button mat-icon-button color="warn" (click)="svc.removeSupplier(s.id)"><mat-icon>delete</mat-icon></button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: [`.full{width:100%}.header{display:flex;align-items:center;gap:12px;margin-bottom:12px}`]
})
export class SuppliersPage {
  svc = inject(InventoryService);
  displayedColumns = ['name','phone','email','actions'];
  private dialog = inject(MatDialog);

  openDialog(supplier?: Supplier) {
    this.dialog.open(SupplierDialog, { data: supplier ?? null, width: '560px' });
  }
}

@Component({
  selector: 'app-supplier-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Agregar' }} proveedor</h2>
    <div mat-dialog-content>
      <form class="form" #f="ngForm">
        <mat-form-field appearance="outline" class="w100">
          <mat-label>Nombre</mat-label>
          <input matInput [(ngModel)]="model.name" name="name" required />
        </mat-form-field>
        <mat-form-field appearance="outline" class="w100">
          <mat-label>Teléfono</mat-label>
          <input matInput [(ngModel)]="model.phone" name="phone" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="w100">
          <mat-label>Email</mat-label>
          <input matInput [(ngModel)]="model.email" name="email" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="w100">
          <mat-label>Dirección</mat-label>
          <input matInput [(ngModel)]="model.address" name="address" />
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()">Guardar</button>
    </div>
  `,
  styles: [`.w100{width:100%}`]
})
export class SupplierDialog {
  svc = inject(InventoryService);
  data: Supplier | null = inject(MAT_DIALOG_DATA, { optional: true });
  dialogRef = inject(MatDialogRef<SupplierDialog>);
  model: any = this.data ? { ...this.data } : { name: '', phone: '', email: '', address: '' };

  save() {
    if (this.model.id) {
      this.svc.updateSupplier(this.model);
    } else {
      this.svc.addSupplier(this.model);
    }
    this.dialogRef.close();
  }
}
