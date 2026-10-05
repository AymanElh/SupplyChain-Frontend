import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ErrorHandler } from '../../../../../core/utils/error-handler';

@Component({
  selector: 'app-vehicle-form',
  imports: [ReactiveFormsModule, RouterLink, PageHeaderComponent],
  templateUrl: './vehicle-form.html',
  styleUrl: './vehicle-form.css',
})
export class VehicleForm implements OnInit{
  private formBuilder = inject(FormBuilder);
  private vehicleService = inject(VehicleService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);

  vehicleForm!: FormGroup;
  isEditMode = false;
  vehicleId?: number;
  isSubmitting = false;

  ngOnInit() {
    this.initForm();
    this.checkIsEditMode();
  }

  private initForm() {
    this.vehicleForm = this.formBuilder.group({
      licensePlate: ['', [Validators.required, Validators.minLength(2)]],
      type: [''],
      model: ['']
    });
  }

  private checkIsEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.vehicleId = +id;
      this.loadVehicle(this.vehicleId);
    }
  }

  private loadVehicle(id: number) {
    this.vehicleService.getVehicle(id).subscribe({
      next: (vehicle) => {
        this.vehicleForm.patchValue(vehicle);
      },
      error: (error) => {
        this.notificationService.error('Load Failed', ErrorHandler.getCompleteErrorMessage(error));
        this.router.navigate(['/delivery/vehicles']);
      }
    })
  }

  onSubmit() {
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      this.notificationService.warning('Invalid Form', 'Please fill in all required fields correctly');
      return;
    }

    this.isSubmitting = true;
    const vehicleData = this.vehicleForm.value;

    const operation = this.isEditMode ? this.vehicleService.updateVehicle(this.vehicleId!, vehicleData) : this.vehicleService.createVehicle(vehicleData);

    operation.subscribe({
      next: () => {
        this.isSubmitting = false;
        const action = this.isEditMode ? 'updated' : 'created';
        this.notificationService.success('Success', `Vehicle ${action} successfully`);
        this.router.navigate(['/delivery/vehicles']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.notificationService.error('Save Failed', ErrorHandler.getCompleteErrorMessage(error));
      }
    })
  }

    isFieldInvalid(fieldName: string): boolean {
    const field = this.vehicleForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.vehicleForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return `${fieldName} is required`;
    if (field.errors['minlength']) return `${fieldName} is too short`;

    return 'Invalid field';
  }
}
