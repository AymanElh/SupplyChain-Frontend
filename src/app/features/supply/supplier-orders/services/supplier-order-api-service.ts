import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SupplierOrderRequest, SupplierOrderResponse } from '../models/supplier-order-model';
import { map, Observable } from 'rxjs';
import { PageResponse } from '../../../../core/models/page-response.model';

@Injectable({
  providedIn: 'root',
})
export class SupplierOrderApiService {
  private apiUrl = `${environment.apiUrl}/supplier-orders`;


  constructor(
    private http: HttpClient
  ) {
  }

  /**
   * Get all supplier orders with pagination
   * @param page page number
   * @param size page size
   * @param sortBy sort by
   * @returns 
   */
  getAll(page: number, size: number, sortBy: string): Observable<PageResponse<SupplierOrderResponse>> {
    return this.http.get<PageResponse<SupplierOrderResponse>>(this.apiUrl, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
        .set('sortBy', sortBy)
    });
  }

  /**
   * Get supplier order by id
   * @param id supplier order id
   * @returns 
   */
  getById(id: number): Observable<SupplierOrderResponse> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(order => ({
        ...order,
        items: order.items.map((item: any) => ({
          id: item.id,
          rawMaterialId: item.materialId,
          rawMaterialName: item.materialName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subTotal: item.subTotal,
        }))
      }))
    );
  }

  /**
   * Create supplier order
   * @param order supplier order
   * @returns 
   */
  create(order: SupplierOrderRequest): Observable<SupplierOrderResponse> {
    return this.http.post<SupplierOrderResponse>(this.apiUrl, order);
  }

  /**
   * Update supplier order
   * @param id supplier order id
   * @param order supplier order
   * @returns 
   */
  updateStatus(id: number, order: SupplierOrderRequest): Observable<SupplierOrderResponse> {
    return this.http.put<SupplierOrderResponse>(`${this.apiUrl}/${id}/status`, order);
  }

  /**
   * Delete supplier order
   * @param id supplier order id
   * @returns 
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
