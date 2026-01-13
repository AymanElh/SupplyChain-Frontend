import { Component, inject, OnInit, signal } from '@angular/core';
import { SupplierOrderService } from '../../services/supplier-order-service';
import { OrderStatus, SupplierOrderResponse } from '../../models/supplier-order-model';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-order-list-component',
  imports: [DecimalPipe, RouterLink],
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
