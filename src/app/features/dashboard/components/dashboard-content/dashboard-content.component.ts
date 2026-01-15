import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-content',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.css']
})
export class DashboardContentComponent {
  stats = [
    { title: 'Total Orders', value: '1,234', change: '+12%', icon: '📊', color: 'blue' },
    { title: 'Inventory Value', value: '$485,230', change: '+8%', icon: '💰', color: 'green' },
    { title: 'Pending Deliveries', value: '47', change: '+5', icon: '📦', color: 'yellow' },
    { title: 'Low Stock Items', value: '8', change: 'URGENT', icon: '⚠️', color: 'red' }
  ];

  recentOrders = [
    { id: 5001, customer: 'Customer 1', amount: 1100, status: 'PENDING' },
    { id: 5002, customer: 'Customer 2', amount: 1200, status: 'IN_PROGRESS' },
    { id: 5003, customer: 'Customer 3', amount: 1300, status: 'COMPLETED' },
    { id: 5004, customer: 'Customer 4', amount: 1400, status: 'PENDING' },
    { id: 5005, customer: 'Customer 5', amount: 1500, status: 'PENDING' }
  ];

  lowStockItems = [
    { name: 'Material 1', stock: 13 },
    { name: 'Material 2', stock: 11 },
    { name: 'Material 3', stock: 9 },
    { name: 'Material 4', stock: 7 },
    { name: 'Material 5', stock: 5 }
  ];
}
