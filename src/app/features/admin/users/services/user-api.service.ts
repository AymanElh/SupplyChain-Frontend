import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { UserRequest, UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {
  }

  /**
   * Get all users
   */
  getAll(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.apiUrl);
  }

  /**
   * Get a user by id
   */
  getById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new user
   */
  create(user: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl, user);
  }

  /**
   * Update a user. Only email and a non-blank password are persisted
   * by the backend; other fields are sent for validation compatibility.
   */
  update(id: number, user: UserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}`, user);
  }

  /**
   * Delete a user (soft delete)
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
