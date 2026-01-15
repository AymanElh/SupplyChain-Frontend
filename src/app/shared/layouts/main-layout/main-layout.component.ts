import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  isSidebarOpen = signal(true);

  toggleSidebar(): void {
    this.isSidebarOpen.update(value => !value);
  }

  navigationItems = [
    { label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { label: 'Orders', icon: '📦', path: '/supply/orders' },
    { label: 'Materials', icon: '📋', path: '/supply/materials' },
    { label: 'Suppliers', icon: '🏭', path: '/supply/suppliers' },
    { label: 'Production', icon: '🏗️', path: '/production' },
    { label: 'Deliveries', icon: '🚚', path: '/deliveries' }
  ];
}
