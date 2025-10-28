import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
  ],
  template: `
    <mat-sidenav-container class="container">
      <mat-sidenav mode="side" [opened]="opened()">
        <div class="brand">Inventario</div>
        <mat-nav-list>
          <a mat-list-item routerLink="/productos">
            <mat-icon>inventory_2</mat-icon>
            <span>Productos</span>
          </a>
          <a mat-list-item routerLink="/ubicaciones">
            <mat-icon>storefront</mat-icon>
            <span>Tiendas / Bodegas</span>
          </a>
          <a mat-list-item routerLink="/proveedores">
            <mat-icon>local_shipping</mat-icon>
            <span>Proveedores</span>
          </a>
          <a mat-list-item routerLink="/compras">
            <mat-icon>shopping_cart</mat-icon>
            <span>Compras</span>
          </a>
          <a mat-list-item routerLink="/transferencias">
            <mat-icon>sync_alt</mat-icon>
            <span>Transferencias</span>
          </a>
          <a mat-list-item routerLink="/ventas">
            <mat-icon>point_of_sale</mat-icon>
            <span>Ventas</span>
          </a>
          <a mat-list-item routerLink="/reportes">
            <mat-icon>analytics</mat-icon>
            <span>Reportes</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary" class="toolbar">
          <span>Inventario</span>
          <span class="spacer"></span>
        </mat-toolbar>
        <div class="content">
          <router-outlet />
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .container { height: 100vh; }
    .toolbar { position: sticky; top: 0; z-index: 10; }
    .content { padding: 16px; }
    .brand { font-weight: 700; padding: 16px; }
    .spacer { flex: 1 1 auto; }
  `]
})
export class ShellComponent {
  opened = signal(true);
}
