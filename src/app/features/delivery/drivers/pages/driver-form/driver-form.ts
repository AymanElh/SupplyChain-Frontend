import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DriverService } from '../../services/driver.service';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ErrorHandler } from '../../../../../core/utils/error-handler';

@Component({
  selector: 'app-driver-form',
  imports: [ReactiveFormsModule, RouterLink, PageHeaderComponent],
  templateUrl: './driver-form.html',
  styleUrl: './driver-form.css',
})
export class DriverForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  private driverService = inject(DriverService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  driverForm!: FormGroup;
  isSubmitting = false;

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.driverForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      licenseNumber: ['', [Validators.required, Validators.minLength(2)]],
      isAvailable: [true]
    });
  }

  onSubmit() {
    if (this.driverForm.invalid) {
      this.driverForm.markAllAsTouched();
      this.notificationService.warning('Invalid Form', 'Please fill in all required fields correctly');
      return;
    }

    this.isSubmitting = true;
    const driverData = this.driverForm.value;

    this.driverService.createDriver(driverData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.notificationService.success('Success', 'Driver created successfully');
        this.router.navigate(['/delivery/drivers']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.notificationService.error('Save Failed', ErrorHandler.getCompleteErrorMessage(error));
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.driverForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.driverForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return `${fieldName} is required`;
    if (field.errors['minlength']) return `${fieldName} is too short`;
    if (field.errors['pattern']) return 'Invalid format';

    return 'Invalid field';
  }
}
