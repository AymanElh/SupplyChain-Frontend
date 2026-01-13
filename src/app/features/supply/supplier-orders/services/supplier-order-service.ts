import { Injectable, computed, signal } from '@angular/core';
import { SupplierOrderApiService } from './supplier-order-api-service';
import { OrderStatus, SupplierOrderRequest, SupplierOrderResponse } from '../models/supplier-order-model';
import { PageResponse } from '../../../../core/models/page-response.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupplierOrderService {
  constructor(
    private api: SupplierOrderApiService
  ) {
  }

  orders = signal<SupplierOrderResponse[]>([]);
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  totalElements = signal<number>(0);
  isLoading = signal<boolean>(false);


  waitingOrders = computed(() => this.orders().filter(order => order.status === OrderStatus.WAITING));
  inProgressOrders = computed(() => this.orders().filter(order => order.status === OrderStatus.IN_PROGRESS));
  receivedOrders = computed(() => this.orders().filter(order => order.status === OrderStatus.RECEIVED));

  totalOrderValue = computed(() =>
    this.orders().reduce((total, order) =>
      total + order.items.reduce((total, item) => total + item.subTotal, 0)
    , 0));

  loadOrders(page: number = 0, size: number = 10, sortBy: string = 'id') {
    this.isLoading.set(true);
    return this.api.getAll(page, size, sortBy).pipe(
      tap({
        next: (response) => {
          this.orders.set(response.content);
          this.currentPage.set(response.number);
          this.totalPages.set(response.totalPages);
          this.totalElements.set(response.totalElements);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      })
    );
  }

  getOrderById(id: number): Observable<SupplierOrderResponse> {
    return this.api.getById(id);
  }

  createOrder(order: SupplierOrderRequest): Observable<SupplierOrderResponse> {
    return this.api.create(order).pipe(
      tap({
        next: (newOrder) => {
          this.orders.update(current => [...current, newOrder]);
        },
        error: () => {
          this.isLoading.set(false);
        }
      })
    );
  }

  updateOrderStatus(id: number, status: OrderStatus): Observable<SupplierOrderResponse> {
    const updatedRequest: SupplierOrderRequest = {status}
    return this.api.updateStatus(id, updatedRequest).pipe(
       tap({
        next: (updated) => {
          this.orders.update(current =>
            current.map(o => o.id === id ? updated : o)
          );
          // this.notification.showSuccess('Order status updated successfully');
        }
      })
    );
  }

  deleteOrder(id: number): Observable<void> {
    return this.api.delete(id).pipe(
      tap({
        next: () => {
          this.orders.update(current => current.filter(order => order.id !== id));
        },
        error: () => {
          this.isLoading.set(false);
        }
      })
    );
  }

  getOrderByStatus(status: OrderStatus): SupplierOrderResponse[] {
    return this.orders().filter(order => order.status === status);
  }

  getOrdersBySupplier(supplierId: number): SupplierOrderResponse[] {
    return this.orders().filter(order => order.supplierId === supplierId);
  }

  calculateOrderTotal(order: SupplierOrderResponse): number {
    return order.items.reduce((total, item) =>
      total + item.subTotal, 0);
  }

  canMarkAsReceived(order: SupplierOrderResponse) {
    return order.status === OrderStatus.IN_PROGRESS;
  }

  canCancel(order: SupplierOrderResponse) {
    return order.status === OrderStatus.WAITING;
  }
}
