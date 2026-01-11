import {Injectable, signal} from '@angular/core';
import {SupplierApiService} from './supplier-api.service';
import {Observable, tap} from 'rxjs';
import {SupplierRequest, SupplierResponse} from '../models/supplier.model';

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
          console.log(response);
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

  getSupplier(id: number) {
    return this.api.getById(id);
  }

  createSupplier(supplier: SupplierRequest) {
    return this.api.create(supplier).pipe(
      tap({
        next: (newSupplier) => {
          this.suppliers.update(curr => [...curr, newSupplier]);
        }
      })
    );
  }

  updateSupplier(id: number, supplier: SupplierRequest): Observable<SupplierResponse> {
    console.log("Update supplier is not available yet");
    return this.api.update(id, supplier);
  }

  deleteSupplier(id: number) {
    return this.api.delete(id).pipe(
      tap({
        next: () => {
          this.suppliers.update(current => current.filter(s => s.id !== id));
        }
      })
    );
  }
}
