import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  isSidebarOpen = signal(true);

  toggleSidebar(): void {
    this.isSidebarOpen.update(value => !value);
  }

  navigationItems = [
    { label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { label: 'Orders', icon: '📦', path: '/supply/orders' },
    { label: 'Materials', icon: '📋', path: '/supply/materials' },
    { label: 'Suppliers', icon: '🏭', path: '/supply/suppliers' },
    { label: 'Analytics', icon: '📈', path: '/analytics' }
  ];
}
