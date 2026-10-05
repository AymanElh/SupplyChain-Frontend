import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { PageResponse } from '../../../../core/models/page-response.model';
import { AddressRequest, CustomerRequest, CustomerResponse } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerApiService {
  private apiUrl = `${environment.apiUrl}/delivery/customers`;

  constructor(private http: HttpClient) {
  }

  /**
   * Get all customers (paged)
   */
  getAll(page: number = 0, size: number = 10, sortBy: string = 'id'): Observable<PageResponse<CustomerResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    return this.http.get<PageResponse<CustomerResponse>>(this.apiUrl, { params });
  }

  /**
   * Get a customer by id (includes addresses and orders)
   */
  getById(id: number): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new customer with addresses
   */
  create(customer: CustomerRequest): Observable<CustomerResponse> {
    return this.http.post<CustomerResponse>(this.apiUrl, customer);
  }

  /**
   * Update a customer
   */
  update(id: number, customer: CustomerRequest): Observable<CustomerResponse> {
    return this.http.put<CustomerResponse>(`${this.apiUrl}/${id}`, customer);
  }

  /**
   * Delete a customer (soft delete)
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Append an address to an existing customer
   */
  addAddress(id: number, address: AddressRequest): Observable<CustomerResponse> {
    return this.http.post<CustomerResponse>(`${this.apiUrl}/${id}/addresses`, address);
  }
}
