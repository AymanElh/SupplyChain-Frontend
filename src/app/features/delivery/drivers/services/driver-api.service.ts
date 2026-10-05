import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {DriverRequest, DriverResponse} from '../models/driver.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DriverApiService {
  private apiUrl = `${environment.apiUrl}/drivers`;

  constructor(
    private http: HttpClient
  ) {
  }

  /**
   * Get all drivers (plain array, not paged)
   *
   * NOTE (backend gap): DriverResponseDTO contains NO id field, so list items
   * cannot be addressed for edit/delete. Only list + create are exposed in
   * the UI until the backend includes an identifier in its responses.
   */
  getAll(): Observable<DriverResponse[]> {
    return this.http.get<DriverResponse[]>(this.apiUrl);
  }

  /**
   * Get driver by id
   * @param id
   */
  getById(id: number): Observable<DriverResponse> {
    return this.http.get<DriverResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new driver
   * @param driver
   */
  create(driver: DriverRequest): Observable<DriverResponse> {
    return this.http.post<DriverResponse>(this.apiUrl, driver);
  }

  /**
   * Update a driver
   * @param id
   * @param driver
   */
  update(id: number, driver: DriverRequest): Observable<DriverResponse> {
    return this.http.put<DriverResponse>(`${this.apiUrl}/${id}`, driver);
  }

  /**
   * Delete a driver by id
   * @param id
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
