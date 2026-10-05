import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {VehicleRequest, VehicleResponse} from '../models/vehicle.model';
import {Observable} from 'rxjs';
import {PageResponse} from '../../../../core/models/page-response.model';

@Injectable({
  providedIn: 'root',
})
export class VehicleApiService {
  private apiUrl = `${environment.apiUrl}/vehicles`;

  constructor(
    private http: HttpClient
  ) {
  }


  /**
   * Get all vehicles
   * @param page
   * @param size
   * @param sort
   */
  getAll(page: number = 0, size: number = 10, sort: string = 'id'): Observable<PageResponse<VehicleResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<PageResponse<VehicleResponse>>(this.apiUrl, { params });
  }


  /**
   * Get vehicle by id
   * @param id
   */
  getById(id: number): Observable<VehicleResponse> {
    return this.http.get<VehicleResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new vehicle
   * @param vehicle
   */
  create(vehicle: VehicleRequest): Observable<VehicleResponse> {
    return this.http.post<VehicleResponse>(this.apiUrl, vehicle);
  }

  /**
   * Update a vehicle
   * @param id
   * @param vehicle
   */
  update(id: number, vehicle: VehicleRequest): Observable<VehicleResponse> {
    return this.http.put<VehicleResponse>(`${this.apiUrl}/${id}`, vehicle);
  }


  /**
   * Delete a vehicle by id
   * @param id
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
