import { Injectable, signal } from '@angular/core';
import { DeliveryApiService } from './delivery-api.service';
import { Observable, tap } from 'rxjs';
import { DeliveryRequest, DeliveryResponse, DeliveryStatus } from '../models/delivery.model';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {

  constructor(
    private api: DeliveryApiService
  ) {
  }

  deliveries = signal<DeliveryResponse[]>([]);
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  totalElements = signal<number>(0);
  isLoading = signal<boolean>(false);
  customerIdFilter = signal<number | null>(null);

  loadDeliveries(page: number = 0, size: number = 10, sortBy: string = 'id') {
    this.isLoading.set(true);
    const customerId = this.customerIdFilter();
    const request = customerId !== null
      ? this.api.getByCustomer(customerId, page, size, sortBy)
      : this.api.getAll(page, size, sortBy);

    return request.pipe(
      tap({
        next: (response) => {
          this.deliveries.set(response.content);
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

  setCustomerFilter(customerId: number | null) {
    this.customerIdFilter.set(customerId);
    this.loadDeliveries(0).subscribe();
  }

  getDelivery(id: number) {
    return this.api.getById(id);
  }

  createDelivery(delivery: DeliveryRequest) {
    return this.api.create(delivery);
  }

  updateStatus(id: number, status: DeliveryStatus): Observable<DeliveryResponse> {
    return this.api.updateStatus(id, status).pipe(
      tap({
        next: (updated) => {
          this.deliveries.update(current => current.map(d => d.id === updated.id ? updated : d));
        }
      })
    );
  }

  deleteDelivery(id: number) {
    return this.api.delete(id).pipe(
      tap({
        next: () => {
          this.deliveries.update(current => current.filter(d => d.id !== id));
        }
      })
    );
  }
}
