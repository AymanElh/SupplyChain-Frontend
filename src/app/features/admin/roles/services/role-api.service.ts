import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { RoleRequest, RoleResponse } from '../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class RoleApiService {
  private apiUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {
  }

  /**
   * Get all roles
   */
  getAll(): Observable<RoleResponse[]> {
    return this.http.get<RoleResponse[]>(this.apiUrl);
  }

  /**
   * Get a role by id
   */
  getById(id: number): Observable<RoleResponse> {
    return this.http.get<RoleResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new role
   */
  create(role: RoleRequest): Observable<RoleResponse> {
    return this.http.post<RoleResponse>(this.apiUrl, role);
  }

  /**
   * Update a role
   */
  update(id: number, role: RoleRequest): Observable<RoleResponse> {
    return this.http.put<RoleResponse>(`${this.apiUrl}/${id}`, role);
  }

  /**
   * Delete a role
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
