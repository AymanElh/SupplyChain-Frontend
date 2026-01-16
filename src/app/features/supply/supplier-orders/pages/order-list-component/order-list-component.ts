import { Component, inject, OnInit, signal } from '@angular/core';
import { SupplierOrderService } from '../../services/supplier-order-service';
import { OrderStatus, SupplierOrderResponse } from '../../models/supplier-order-model';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from "@angular/router";
import { StatsCardComponent } from '../../../../../shared/components/stats-card/stats-card.component/stats-card.component';

@Component({
  selector: 'app-order-list-component',
  imports: [DecimalPipe, RouterLink, StatsCardComponent],
  templateUrl: './order-list-component.html',
  styleUrl: './order-list-component.css',
})
export class OrderListComponent implements OnInit {
  orderService = inject(SupplierOrderService);

  filterStatus = signal<OrderStatus | 'ALL'>('ALL');
  pageSize = signal<number>(10);

  orders = this.orderService.orders;
  isLoading = this.orderService.isLoading;
  currentPage = this.orderService.currentPage;
  totalPages = this.orderService.totalPages;
  totalElements = this.orderService.totalElements;

  // Stats cards configuration
  get statsCards() {
    return [
      {
        title: 'Total Orders',
        value: this.orders().length.toString(),
        icon: '🛒',
        iconBgColor: 'blue',
        trend: 'All orders',
        trendColor: 'gray'
      },
      {
        title: 'Waiting',
        value: this.orderService.waitingOrders().length.toString(),
        icon: '⏰',
        iconBgColor: 'yellow',
        trend: 'Pending orders',
        trendColor: 'yellow'
      },
      {
        title: 'In Progress',
        value: this.orderService.inProgressOrders().length.toString(),
        icon: '⏳',
        iconBgColor: 'blue',
        trend: 'Active orders',
        trendColor: 'blue'
      },
      {
        title: 'Received',
        value: this.orderService.receivedOrders().length.toString(),
        icon: '✅',
        iconBgColor: 'green',
        trend: 'Completed',
        trendColor: 'green'
      }
    ];
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.loadOrders(
      this.currentPage(),
      this.pageSize(),
      'id'
    ).subscribe();
  }

  getFilteredOrders(): SupplierOrderResponse[] {
    if (this.filterStatus() === 'ALL') {
      return this.orders();
    }
    return this.orders().filter(order => order.status === this.filterStatus());
  }

  setFilterStatus(status: OrderStatus): void {
    this.filterStatus.set(status)
  }

  protected readonly OrderStatus = OrderStatus;
}
