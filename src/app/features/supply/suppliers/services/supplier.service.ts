import {Injectable, signal} from '@angular/core';
import {SupplierApiService} from './supplier-api.service';
import {tap} from 'rxjs';
import {SupplierResponse} from '../models/supplier.model';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {

  constructor(
    private api: SupplierApiService
  ) {
  }

  suppliers = signal<SupplierResponse[]>([]);
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  totalElements = signal<number>(0);
  isLoading = signal<boolean>(false);

  loadSuppliers(page: number = 0, size: number = 10, sortBy: string = 'id') {
    this.isLoading.set(true);
    return this.api.getAll(page, size, sortBy).pipe(
      tap({
        next: (response) => {
          this.suppliers.set(response.content);
          this.currentPage.set(response.number);
          this.totalPages.set(response.totalPages);
          this.totalElements.set(response.totalElements);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      })
    )
  }
}
