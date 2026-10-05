import { Injectable, signal } from '@angular/core';
import { UserApiService } from './user-api.service';
import { tap } from 'rxjs';
import { UserRequest, UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(
    private api: UserApiService
  ) {
  }

  users = signal<UserResponse[]>([]);
  isLoading = signal<boolean>(false);

  loadUsers() {
    this.isLoading.set(true);
    return this.api.getAll().pipe(
      tap({
        next: (users) => {
          this.users.set(users);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      })
    );
  }

  getUser(id: number) {
    return this.api.getById(id);
  }

  createUser(user: UserRequest) {
    return this.api.create(user).pipe(
      tap({
        next: (newUser) => {
          this.users.update(curr => [...curr, newUser]);
        }
      })
    );
  }

  updateUser(id: number, user: UserRequest) {
    return this.api.update(id, user);
  }

  deleteUser(id: number) {
    return this.api.delete(id).pipe(
      tap({
        next: () => {
          this.users.update(current => current.filter(u => u.id !== id));
        }
      })
    );
  }
}
