import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { PageResponse } from '../../../../core/models/page-response.model';
import { RawMaterialRequest, RawMaterialResponse } from '../models/raw-material.model';

@Injectable({
  providedIn: 'root',
})
export class RawMaterialApiService {
  private apiUrl: string = `${environment.apiUrl}/materials`;

  constructor(private http: HttpClient) { }

  /**
   * Get all raw materials
   * @param page 
   * @param size 
   * @returns 
   */
  getAll(page: number = 1, size: number = 10): Observable<PageResponse<RawMaterialResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<RawMaterialResponse>>(this.apiUrl, {params});
  }

  /**
   * Get raw material by id
   * @param id 
   * @returns 
   */
  getById(id: number): Observable<RawMaterialResponse> {
    return this.http.get<RawMaterialResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create raw material
   * @param rawMaterial 
   * @returns 
   */
  create(rawMaterial: RawMaterialRequest): Observable<RawMaterialResponse> {
    return this.http.post<RawMaterialResponse>(this.apiUrl, rawMaterial);
  }

  /**
   * Update raw material
   * @param id 
   * @param rawMaterial 
   * @returns 
   */
  update(id: number, rawMaterial: RawMaterialRequest): Observable<RawMaterialResponse> {
    return this.http.put<RawMaterialResponse>(`${this.apiUrl}/${id}`, rawMaterial);
  }

  /**
   * Delete raw material
   * @param id 
   * @returns 
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
