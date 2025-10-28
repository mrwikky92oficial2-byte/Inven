import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../core/services/inventory.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-products',
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
    ReactiveFormsModule,
    MatSlideToggleModule,
  ],
  template: `
    <div class="header">
      <h2>Productos</h2>
      <button mat-flat-button color="primary" (click)="openDialog()">
        <mat-icon>add</mat-icon>
        Agregar
      </button>
    </div>

    <table mat-table [dataSource]="products()" class="mat-elevation-z1 full">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Nombre</th>
        <td mat-cell *matCellDef="let p">{{ p.name }}</td>
      </ng-container>

      <ng-container matColumnDef="category">
        <th mat-header-cell *matHeaderCellDef>Categoría</th>
        <td mat-cell *matCellDef="let p">{{ p.category }}</td>
      </ng-container>

      <ng-container matColumnDef="stock">
        <th mat-header-cell *matHeaderCellDef>Stock</th>
        <td mat-cell *matCellDef="let p">{{ totalStock(p.id) }}</td>
      </ng-container>

      <ng-container matColumnDef="minStock">
        <th mat-header-cell *matHeaderCellDef>Stock mín.</th>
        <td mat-cell *matCellDef="let p">{{ p.minStock }}</td>
      </ng-container>

      <ng-container matColumnDef="maxStock">
        <th mat-header-cell *matHeaderCellDef>Stock máx.</th>
        <td mat-cell *matCellDef="let p">{{ p.maxStock }}</td>
      </ng-container>

      <ng-container matColumnDef="purchasePrice">
        <th mat-header-cell *matHeaderCellDef>Precio compra</th>
        <td mat-cell *matCellDef="let p">{{ p.purchasePrice | currency }}</td>
      </ng-container>

      <ng-container matColumnDef="salePrice">
        <th mat-header-cell *matHeaderCellDef>Precio venta</th>
        <td mat-cell *matCellDef="let p">{{ p.salePrice | currency }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let p">
          <button mat-icon-button color="primary" (click)="openDialog(p)"><mat-icon>edit</mat-icon></button>
          <button mat-icon-button color="warn" (click)="remove(p.id)"><mat-icon>delete</mat-icon></button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: [`.full{width:100%}.header{display:flex;align-items:center;gap:12px;margin-bottom:12px}`]
})
export class ProductsPage {
  svc = inject(InventoryService);
  products = this.svc.products;
  displayedColumns = ['name','category','stock','minStock','maxStock','purchasePrice','salePrice','actions'];

  private dialog = inject(MatDialog);

  openDialog(product?: any) {
    this.dialog.open(ProductDialog, { data: product ?? null, width: '600px' });
  }
  remove(id: string) {
    this.svc.removeProduct(id);
  }

  totalStock(productId: string): number {
    return this.svc.stock().filter(s => s.productId === productId).reduce((sum, s) => sum + (s.quantity || 0), 0);
  }
}

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSlideToggleModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Agregar' }} producto</h2>
    <div mat-dialog-content>
      <form class="form" #f="ngForm">
        <mat-form-field appearance="outline">
          <mat-label>Nombre</mat-label>
          <input matInput [(ngModel)]="model.name" name="name" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Categoría</mat-label>
          <input matInput [(ngModel)]="model.category" name="category" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Stock mín.</mat-label>
          <input matInput type="number" [(ngModel)]="model.minStock" name="minStock" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Stock máx.</mat-label>
          <input matInput type="number" [(ngModel)]="model.maxStock" name="maxStock" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Precio compra</mat-label>
          <input matInput type="number" [(ngModel)]="model.purchasePrice" name="purchasePrice" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Precio venta</mat-label>
          <input matInput type="number" [(ngModel)]="model.salePrice" name="salePrice" />
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()">Guardar</button>
    </div>
  `,
})
export class ProductDialog {
  svc = inject(InventoryService);
  data = inject(MAT_DIALOG_DATA, { optional: true }) as any;
  dialogRef = inject(MatDialogRef<ProductDialog>);
  model: any = this.data ? { ...this.data } : { name: '', category: '', minStock: 0, maxStock: 0, purchasePrice: 0, salePrice: 0 };

  save() {
    if (this.model.id) {
      this.svc.updateProduct(this.model);
    } else {
      this.svc.addProduct(this.model);
    }
    this.dialogRef.close();
  }
}
