import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { PageResponse } from '../../../../core/models/page-response.model';
import {
  DeliveryRequest,
  DeliveryResponse,
  DeliveryStatus,
  UpdateDeliveryStatusRequest
} from '../models/delivery.model';

@Injectable({
  providedIn: 'root',
})
export class DeliveryApiService {
  private apiUrl = `${environment.apiUrl}/deliveries`;

  constructor(private http: HttpClient) {
  }

  /**
   * Get all deliveries (paged)
   */
  getAll(page: number = 0, size: number = 10, sortBy: string = 'id'): Observable<PageResponse<DeliveryResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    return this.http.get<PageResponse<DeliveryResponse>>(this.apiUrl, { params });
  }

  /**
   * Get deliveries for one customer (paged)
   */
  getByCustomer(customerId: number, page: number = 0, size: number = 10, sortBy: string = 'id'): Observable<PageResponse<DeliveryResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    return this.http.get<PageResponse<DeliveryResponse>>(`${this.apiUrl}/customer/${customerId}`, { params });
  }

  /**
   * Get a delivery by id
   */
  getById(id: number): Observable<DeliveryResponse> {
    return this.http.get<DeliveryResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Schedule a delivery for a READY customer order
   */
  create(delivery: DeliveryRequest): Observable<DeliveryResponse> {
    return this.http.post<DeliveryResponse>(this.apiUrl, delivery);
  }

  /**
   * Update the delivery status
   */
  updateStatus(id: number, status: DeliveryStatus): Observable<DeliveryResponse> {
    const body: UpdateDeliveryStatusRequest = { status };
    return this.http.patch<DeliveryResponse>(`${this.apiUrl}/${id}/status`, body);
  }

  /**
   * Delete a delivery
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
