import { Injectable, signal } from '@angular/core';
import { CustomerOrderApiService } from './customer-order-api.service';
import { Observable, tap } from 'rxjs';
import { PageResponse } from '../../../../core/models/page-response.model';
import {
  CustomerOrderFilter,
  CustomerOrderRequest,
  CustomerOrderResponse,
  CustomerOrderStatus
} from '../models/customer-order.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerOrderService {

  constructor(
    private api: CustomerOrderApiService
  ) {
  }

  orders = signal<CustomerOrderResponse[]>([]);
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  totalElements = signal<number>(0);
  isLoading = signal<boolean>(false);
  filterStatus = signal<CustomerOrderFilter>('PENDING');
  customerIdFilter = signal<number | null>(null);

  loadOrders(page: number = 0, size: number = 10, sortBy: string = 'id'): Observable<PageResponse<CustomerOrderResponse> | CustomerOrderResponse[]> {
    this.isLoading.set(true);

    // Customer-scoped view uses the dedicated endpoint (plain list)
    if (this.customerIdFilter() !== null) {
      return this.api.getByCustomer(this.customerIdFilter() as number).pipe(
        tap({
          next: (orders) => {
            const status = this.filterStatus();
            this.orders.set(status === 'ALL' ? orders : orders.filter(o => o.status === status));
            this.currentPage.set(0);
            this.totalPages.set(1);
            this.totalElements.set(this.orders().length);
            this.isLoading.set(false);
          },
          error: () => {
            this.isLoading.set(false);
          }
        })
      );
    }

    const status = this.filterStatus() === 'ALL' ? 'PENDING' : this.filterStatus();
    return this.api.getAll(status as CustomerOrderStatus, page, size, sortBy).pipe(
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

  /**
   * One-off status-scoped fetch that does not disturb list signals.
   * Used by pickers (e.g. delivery scheduling needs READY orders).
   */
  loadOrdersFiltered(status: CustomerOrderStatus, page: number = 0, size: number = 100, sortBy: string = 'id') {
    return this.api.getAll(status, page, size, sortBy);
  }

  setFilter(status: CustomerOrderFilter) {
    this.filterStatus.set(status);
    this.loadOrders(0).subscribe();
  }

  setCustomerFilter(customerId: number | null) {
    this.customerIdFilter.set(customerId);
    this.loadOrders(0).subscribe();
  }

  getOrder(id: number) {
    return this.api.getById(id);
  }

  createOrder(order: CustomerOrderRequest) {
    return this.api.create(order);
  }

  updateStatus(id: number, status: CustomerOrderStatus): Observable<CustomerOrderResponse> {
    return this.api.updateStatus(id, status).pipe(
      tap({
        next: (updated) => {
          this.orders.update(current => current.map(o => o.id === updated.id ? updated : o));
        }
      })
    );
  }

  deleteOrder(id: number) {
    return this.api.delete(id).pipe(
      tap({
        next: () => {
          this.orders.update(current => current.filter(o => o.id !== id));
        }
      })
    );
  }
}
