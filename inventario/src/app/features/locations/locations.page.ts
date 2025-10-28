import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../core/services/inventory.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Location } from '../../core/models/location.model';

@Component({
  selector: 'app-locations',
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
      <h2>Tiendas / Bodegas</h2>
      <button mat-flat-button color="primary" (click)="openDialog()">
        <mat-icon>add</mat-icon>
        Agregar
      </button>
    </div>

    <table mat-table [dataSource]="svc.locations()" class="mat-elevation-z1 full">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Nombre</th>
        <td mat-cell *matCellDef="let l">{{ l.name }}</td>
      </ng-container>

      <ng-container matColumnDef="type">
        <th mat-header-cell *matHeaderCellDef>Tipo</th>
        <td mat-cell *matCellDef="let l">{{ l.type === 'store' ? 'Tienda' : 'Bodega' }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let l">
          <button mat-icon-button color="primary" (click)="openDialog(l)"><mat-icon>edit</mat-icon></button>
          <button mat-icon-button color="warn" (click)="svc.removeLocation(l.id)"><mat-icon>delete</mat-icon></button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: [`.full{width:100%}.header{display:flex;align-items:center;gap:12px;margin-bottom:12px}`]
})
export class LocationsPage {
  svc = inject(InventoryService);
  displayedColumns = ['name','type','actions'];
  private dialog = inject(MatDialog);

  openDialog(location?: Location) {
    this.dialog.open(LocationDialog, { data: location ?? null, width: '480px' });
  }
}

@Component({
  selector: 'app-location-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Agregar' }} ubicación</h2>
    <div mat-dialog-content>
      <form class="form" #f="ngForm">
        <mat-form-field appearance="outline" class="w100">
          <mat-label>Nombre</mat-label>
          <input matInput [(ngModel)]="model.name" name="name" required />
        </mat-form-field>
        <mat-form-field appearance="outline" class="w100">
          <mat-label>Tipo</mat-label>
          <mat-select [(ngModel)]="model.type" name="type">
            <mat-option [value]="'store'">Tienda</mat-option>
            <mat-option [value]="'warehouse'">Bodega</mat-option>
          </mat-select>
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
export class LocationDialog {
  svc = inject(InventoryService);
  data: Location | null = inject(MAT_DIALOG_DATA, { optional: true });
  dialogRef = inject(MatDialogRef<LocationDialog>);
  model: any = this.data ? { ...this.data } : { name: '', type: 'store' };

  save() {
    if (this.model.id) {
      this.svc.updateLocation(this.model);
    } else {
      this.svc.addLocation(this.model);
    }
    this.dialogRef.close();
  }
}
