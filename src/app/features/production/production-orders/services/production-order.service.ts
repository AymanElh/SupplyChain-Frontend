import { computed, Injectable, signal } from '@angular/core';
import { ProductionOrderApiService } from './production-order-api.service';
import { Observable, tap } from 'rxjs';
import {
  ProductionOrderFilter,
  ProductionOrderRequest,
  ProductionOrderResponse,
  ProductionStatus
} from '../models/production-order.model';

@Injectable({
  providedIn: 'root',
})
export class ProductionOrderService {

  constructor(
    private api: ProductionOrderApiService
  ) {
  }

  orders = signal<ProductionOrderResponse[]>([]);
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  totalElements = signal<number>(0);
  isLoading = signal<boolean>(false);
  filterStatus = signal<ProductionOrderFilter>('ALL');

  inWaitingCount = computed(() => this.orders().filter(o => o.status === 'IN_WAITING').length);
  inProductionCount = computed(() => this.orders().filter(o => o.status === 'IN_PRODUCTION').length);

  loadOrders(page: number = 0, size: number = 10, sortBy: string = 'id') {
    this.isLoading.set(true);
    const request = this.filterStatus() === 'ALL'
      ? this.api.getAll(page, size, sortBy)
      : this.api.getByStatus(this.filterStatus() as ProductionStatus, page, size, sortBy);

    return request.pipe(
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

  setFilter(status: ProductionOrderFilter) {
    this.filterStatus.set(status);
    this.loadOrders(0).subscribe();
  }

  getOrder(id: number) {
    return this.api.getById(id);
  }

  createOrder(order: ProductionOrderRequest) {
    return this.api.create(order);
  }

  startProduction(id: number): Observable<ProductionOrderResponse> {
    return this.api.startProduction(id).pipe(
      tap({ next: (updated) => this.replaceOrder(updated) })
    );
  }

  completeProduction(id: number): Observable<ProductionOrderResponse> {
    return this.api.completeProduction(id).pipe(
      tap({ next: (updated) => this.replaceOrder(updated) })
    );
  }

  updateStatus(id: number, status: ProductionStatus): Observable<ProductionOrderResponse> {
    return this.api.updateStatus(id, status).pipe(
      tap({ next: (updated) => this.replaceOrder(updated) })
    );
  }

  updateQuantity(id: number, quantity: number): Observable<ProductionOrderResponse> {
    return this.api.updateQuantity(id, quantity).pipe(
      tap({ next: (updated) => this.replaceOrder(updated) })
    );
  }

  cancelOrder(id: number) {
    return this.api.delete(id).pipe(
      tap({
        next: () => {
          this.orders.update(current => current.filter(o => o.id !== id));
        }
      })
    );
  }

  private replaceOrder(updated: ProductionOrderResponse) {
    this.orders.update(current => current.map(o => o.id === updated.id ? updated : o));
  }
}
