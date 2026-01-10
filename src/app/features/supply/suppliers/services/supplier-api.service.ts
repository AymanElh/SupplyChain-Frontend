import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {SupplierRequest, SupplierResponse} from '../models/supplier.model';
import {Observable} from 'rxjs';
import {PageResponse} from '../../../../core/models/page-response.model';

@Injectable({
  providedIn: 'root',
})
export class SupplierApiService {
  private apiUrl = `${environment.apiUrl}/suppliers`;

  constructor(
    private http: HttpClient
  ) {
  }


  /**
   * Get all suppliers
   * @param page
   * @param size
   * @param sortBy
   */
  getAll(page: number = 0, size: number = 10, sortBy: string = 'id'): Observable<PageResponse<SupplierResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    return this.http.get<PageResponse<SupplierResponse>>(this.apiUrl, { params });
  }


  /**
   * Get Supplier by id
   * @param id
   */
  getById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new supplier
   * @param supplier
   */
  create(supplier: SupplierRequest) {
    return this.http.post(this.apiUrl, supplier);
  }

  /**
   * Update a supplier
   * @param id
   * @param supplier
   */
  update(id: number, supplier: SupplierRequest) {
    return this.http.put(`${this.apiUrl}/${id}`, supplier);
  }


  /**
   * Delete a supplier by id
   * @param id
   */
  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
