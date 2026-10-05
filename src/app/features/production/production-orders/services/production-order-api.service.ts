import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { PageResponse } from '../../../../core/models/page-response.model';
import {
  ProductionOrderRequest,
  ProductionOrderResponse,
  ProductionStatus,
  UpdateProductionOrderQuantityRequest,
  UpdateProductionOrderStatusRequest
} from '../models/production-order.model';

@Injectable({
  providedIn: 'root',
})
export class ProductionOrderApiService {
  private apiUrl = `${environment.apiUrl}/production-orders`;

  constructor(private http: HttpClient) {
  }

  /**
   * Get all production orders (paged)
   */
  getAll(page: number = 0, size: number = 10, sortBy: string = 'id'): Observable<PageResponse<ProductionOrderResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    return this.http.get<PageResponse<ProductionOrderResponse>>(this.apiUrl, { params });
  }

  /**
   * Get production orders filtered by status (paged)
   */
  getByStatus(status: ProductionStatus, page: number = 0, size: number = 10, sortBy: string = 'id'): Observable<PageResponse<ProductionOrderResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    return this.http.get<PageResponse<ProductionOrderResponse>>(`${this.apiUrl}/status/${status}`, { params });
  }

  /**
   * Get a production order by id
   */
  getById(id: number): Observable<ProductionOrderResponse> {
    return this.http.get<ProductionOrderResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new production order (starts in IN_WAITING)
   */
  create(order: ProductionOrderRequest): Observable<ProductionOrderResponse> {
    return this.http.post<ProductionOrderResponse>(this.apiUrl, order);
  }

  /**
   * Move an order to IN_PRODUCTION (consumes raw material stock)
   */
  startProduction(id: number): Observable<ProductionOrderResponse> {
    return this.http.post<ProductionOrderResponse>(`${this.apiUrl}/${id}/start-production`, null);
  }

  /**
   * Move an order to FINISHED (adds finished stock to the product)
   */
  completeProduction(id: number): Observable<ProductionOrderResponse> {
    return this.http.post<ProductionOrderResponse>(`${this.apiUrl}/${id}/complete-production`, null);
  }

  /**
   * Generic status update (used for blocking / unblocking)
   */
  updateStatus(id: number, status: ProductionStatus): Observable<ProductionOrderResponse> {
    const body: UpdateProductionOrderStatusRequest = { status };
    return this.http.patch<ProductionOrderResponse>(`${this.apiUrl}/${id}/status`, body);
  }

  /**
   * Update the ordered quantity (only effective while IN_WAITING)
   */
  updateQuantity(id: number, quantity: number): Observable<ProductionOrderResponse> {
    const body: UpdateProductionOrderQuantityRequest = { quantity };
    return this.http.patch<ProductionOrderResponse>(`${this.apiUrl}/${id}/quantity`, body);
  }

  /**
   * Cancel a production order (only effective while IN_WAITING)
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
