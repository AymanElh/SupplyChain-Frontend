import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../services/role.service';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ErrorHandler } from '../../../../../core/utils/error-handler';

@Component({
  selector: 'app-role-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent],
  templateUrl: './role-form.html'
})
export class RoleForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private roleService = inject(RoleService);
  private notification = inject(NotificationService);

  roleForm!: FormGroup;
  isEditMode = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  private editingId: number | null = null;

  ngOnInit(): void {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Z][A-Z0-9_]*$/)]]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.editingId = +id;
      this.roleService.getRole(+id).subscribe({
        next: (role) => this.roleForm.patchValue({ name: role.name }),
        error: (error) => {
          this.notification.error('Error', ErrorHandler.getCompleteErrorMessage(error));
          this.router.navigate(['/admin/roles']);
        }
      });
    }
  }

  onSubmit(): void {
    const name = (this.roleForm.value.name || '').trim().toUpperCase().replace(/\s+/g, '_');
    if (!name) {
      this.roleForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const request = this.isEditMode() && this.editingId !== null
      ? this.roleService.updateRole(this.editingId, { name })
      : this.roleService.createRole({ name });

    request.subscribe({
      next: () => {
        this.notification.success('Success', this.isEditMode() ? 'Role updated' : `Role ${name} created`);
        this.isSubmitting.set(false);
        this.router.navigate(['/admin/roles']);
      },
      error: (error) => {
        console.error('Error saving role:', error);
        this.notification.error('Error', ErrorHandler.getCompleteErrorMessage(error));
        this.isSubmitting.set(false);
      }
    });
  }
}
