import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../../roles/services/role.service';
import { RoleResponse } from '../../../roles/models/role.model';
import { UserRequest, UserResponse } from '../../models/user.model';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ErrorHandler } from '../../../../../core/utils/error-handler';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent],
  templateUrl: './user-form.html'
})
export class UserForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private roleService = inject(RoleService);
  private notification = inject(NotificationService);

  userForm!: FormGroup;
  isEditMode = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  roles = signal<RoleResponse[]>([]);
  private editingUser: UserResponse | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEditMode.set(!!id);

    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      phone: [''],
      roleId: [null, [Validators.required]]
    });

    this.roleService.loadRoles().subscribe({
      next: () => {
        this.roles.set(this.roleService.roles());
        this.preselectRole();
      }
    });

    if (id) {
      this.loadUser(+id);
    }
  }

  private loadUser(id: number): void {
    this.userService.getUser(id).subscribe({
      next: (user) => {
        this.editingUser = user;
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone
        });
        // Name and phone are read-only on edit: the backend update
        // endpoint only persists email and password.
        this.userForm.get('name')?.disable();
        this.userForm.get('phone')?.disable();
        this.preselectRole();
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.notification.error('Error', ErrorHandler.getCompleteErrorMessage(error));
        this.router.navigate(['/admin/users']);
      }
    });
  }

  private preselectRole(): void {
    if (!this.isEditMode() || !this.editingUser || this.roles().length === 0) {
      return;
    }
    const match = this.roles().find(r => r.name === this.editingUser!.roleName);
    if (match) {
      this.userForm.get('roleId')?.setValue(match.id);
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.notification.error('Validation Error', 'Please fill in all required fields correctly');
      return;
    }

    this.isSubmitting.set(true);
    const raw = this.userForm.getRawValue();

    let payload: UserRequest;
    if (this.isEditMode() && this.editingUser) {
      // Backend ignores name/phone/role on update but validates them;
      // password is always required, so editing sets a new password.
      payload = {
        name: this.editingUser.name,
        email: raw.email,
        password: raw.password,
        phone: this.editingUser.phone,
        roleId: +raw.roleId
      };
      this.userService.updateUser(this.editingUser.id, payload).subscribe(this.saveHandlers('User updated successfully'));
    } else {
      payload = {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        phone: raw.phone || '',
        roleId: +raw.roleId
      };
      this.userService.createUser(payload).subscribe(this.saveHandlers(`User ${payload.name} created`, true));
    }
  }

  private saveHandlers(successMessage: string, goToDetail = false) {
    return {
      next: (user: UserResponse) => {
        this.notification.success('Success', successMessage);
        this.isSubmitting.set(false);
        this.router.navigate(goToDetail ? ['/admin/users', user.id] : ['/admin/users']);
      },
      error: (error: unknown) => {
        console.error('Error saving user:', error);
        this.notification.error('Error', ErrorHandler.getCompleteErrorMessage(error));
        this.isSubmitting.set(false);
      }
    };
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.hasError('required')) return 'This field is required';
    if (field?.hasError('email')) return 'Enter a valid email address';
    if (field?.hasError('minlength')) return 'Password must be at least 5 characters';
    return '';
  }
}
