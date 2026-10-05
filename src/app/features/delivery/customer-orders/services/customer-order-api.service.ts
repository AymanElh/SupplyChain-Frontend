import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { PageResponse } from '../../../../core/models/page-response.model';
import {
  CustomerOrderRequest,
  CustomerOrderResponse,
  CustomerOrderStatus,
  UpdateCustomerOrderStatusRequest
} from '../models/customer-order.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerOrderApiService {
  private apiUrl = `${environment.apiUrl}/customer-orders`;

  constructor(private http: HttpClient) {
  }

  /**
   * List customer orders filtered by status (backend requires status)
   */
  getAll(status: CustomerOrderStatus = 'PENDING', page: number = 0, size: number = 10, sortBy: string = 'id'): Observable<PageResponse<CustomerOrderResponse>> {
    const params = new HttpParams()
      .set('status', status)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    return this.http.get<PageResponse<CustomerOrderResponse>>(this.apiUrl, { params });
  }

  /**
   * List all orders placed by one customer
   */
  getByCustomer(customerId: number): Observable<CustomerOrderResponse[]> {
    return this.http.get<CustomerOrderResponse[]>(`${this.apiUrl}/customer/${customerId}`);
  }

  /**
   * Get a customer order by id
   */
  getById(id: number): Observable<CustomerOrderResponse> {
    return this.http.get<CustomerOrderResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a customer order (starts PENDING, reserves stock)
   */
  create(order: CustomerOrderRequest): Observable<CustomerOrderResponse> {
    return this.http.post<CustomerOrderResponse>(this.apiUrl, order);
  }

  /**
   * Advance (or cancel) the order status
   */
  updateStatus(id: number, status: CustomerOrderStatus): Observable<CustomerOrderResponse> {
    const body: UpdateCustomerOrderStatusRequest = { status };
    return this.http.patch<CustomerOrderResponse>(`${this.apiUrl}/${id}/status`, body);
  }

  /**
   * Cancel / delete a customer order
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
