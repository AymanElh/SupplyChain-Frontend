import { Injectable, signal } from '@angular/core';
import { CustomerApiService } from './customer-api.service';
import { Observable, tap } from 'rxjs';
import { AddressRequest, CustomerRequest, CustomerResponse } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {

  constructor(
    private api: CustomerApiService
  ) {
  }

  customers = signal<CustomerResponse[]>([]);
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  totalElements = signal<number>(0);
  isLoading = signal<boolean>(false);

  loadCustomers(page: number = 0, size: number = 10, sortBy: string = 'id') {
    this.isLoading.set(true);
    return this.api.getAll(page, size, sortBy).pipe(
      tap({
        next: (response) => {
          this.customers.set(response.content);
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

  getCustomer(id: number) {
    return this.api.getById(id);
  }

  createCustomer(customer: CustomerRequest) {
    return this.api.create(customer).pipe(
      tap({
        next: (newCustomer) => {
          this.customers.update(curr => [...curr, newCustomer]);
        }
      })
    );
  }

  updateCustomer(id: number, customer: CustomerRequest): Observable<CustomerResponse> {
    return this.api.update(id, customer);
  }

  deleteCustomer(id: number) {
    return this.api.delete(id).pipe(
      tap({
        next: () => {
          this.customers.update(current => current.filter(c => c.id !== id));
        }
      })
    );
  }

  addAddress(id: number, address: AddressRequest): Observable<CustomerResponse> {
    return this.api.addAddress(id, address);
  }
}
