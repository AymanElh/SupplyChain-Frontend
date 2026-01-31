import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Customer, CustomerPageResponse, CustomerRequest } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/delivery/customers`;

  /**
   * Fetch all customers with pagination
   * @param page - Page number (0-indexed)
   * @param size - Number of items per page
   * @param sort - Sort field (optional)
   */
  getCustomers(page: number = 0, size: number = 10, sort: string = 'id'): Observable<CustomerPageResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<CustomerPageResponse>(this.apiUrl, { params });
  }

  /**
   * Fetch a single customer by ID
   * @param id - Customer ID
   */
  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new customer
   * @param customer - Customer data
   */
  createCustomer(customer: CustomerRequest): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  /**
   * Update an existing customer
   * @param id - Customer ID
   * @param customer - Updated customer data
   */
  updateCustomer(id: number, customer: CustomerRequest): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer);
  }

  /**
   * Delete a customer
   * @param id - Customer ID
   */
  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Search customers by name
   * @param name - Customer name to search
   * @param page - Page number
   * @param size - Page size
   */
  searchCustomers(name: string, page: number = 0, size: number = 10): Observable<CustomerPageResponse> {
    const params = new HttpParams()
      .set('name', name)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<CustomerPageResponse>(`${this.apiUrl}/search`, { params });
  }
}
