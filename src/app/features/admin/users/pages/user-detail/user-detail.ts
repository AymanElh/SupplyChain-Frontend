import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../models/user.model';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ErrorHandler } from '../../../../../core/utils/error-handler';

@Component({
  selector: 'app-user-detail',
  imports: [CommonModule, RouterLink, PageHeaderComponent],
  templateUrl: './user-detail.html'
})
export class UserDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private notification = inject(NotificationService);

  user = signal<UserResponse | null>(null);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUser(+id);
    }
  }

  loadUser(id: number): void {
    this.isLoading.set(true);
    this.userService.getUser(id).subscribe({
      next: (user) => {
        this.user.set(user);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.notification.error('Error', ErrorHandler.getCompleteErrorMessage(error));
        this.isLoading.set(false);
        this.router.navigate(['/admin/users']);
      }
    });
  }

  onDelete(): void {
    const user = this.user();
    if (!user) return;
    if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.notification.success('Success', 'User deleted');
          this.router.navigate(['/admin/users']);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.notification.error('Error', ErrorHandler.getCompleteErrorMessage(error));
        }
      });
    }
  }
}
