import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DeliveryService } from '../../services/delivery.service';
import { CustomerOrderService } from '../../../customer-orders/services/customer-order.service';
import { DriverService } from '../../../drivers/services/driver.service';
import { VehicleService } from '../../../vehicles/services/vehicle.service';
import { CustomerOrderResponse } from '../../../customer-orders/models/customer-order.model';
import { DriverResponse } from '../../../drivers/models/driver.model';
import { VehicleResponse } from '../../../vehicles/models/vehicle.model';
import { DeliveryRequest } from '../../models/delivery.model';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ErrorHandler } from '../../../../../core/utils/error-handler';

@Component({
  selector: 'app-delivery-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent],
  templateUrl: './delivery-form.html'
})
export class DeliveryForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private deliveryService = inject(DeliveryService);
  private customerOrderService = inject(CustomerOrderService);
  private driverService = inject(DriverService);
  private vehicleService = inject(VehicleService);
  private notification = inject(NotificationService);

  deliveryForm!: FormGroup;
  isSubmitting = signal<boolean>(false);
  isLoadingOptions = signal<boolean>(true);

  readyOrders = signal<CustomerOrderResponse[]>([]);
  drivers = signal<DriverResponse[]>([]);
  vehicles = signal<VehicleResponse[]>([]);

  /**
   * Known driver IDs, resolved from existing deliveries.
   * The backend driver endpoints do not expose the entity id, so only
   * drivers already assigned to a delivery can be selected by id.
   */
  driverIds = signal<Map<string, number>>(new Map());

  driverOptionKey = (driver: DriverResponse): string => `${driver.name}|${driver.phone}`;

  driverOptionId = (driver: DriverResponse): number | null =>
    this.driverIds().get(this.driverOptionKey(driver)) ?? null;

  minDeliveryDate = signal<string>(this.toDateInputValue(this.addDays(new Date(), 1)));

  ngOnInit(): void {
    this.deliveryForm = this.fb.group({
      orderId: [null, [Validators.required]],
      driverId: [null, [Validators.required]],
      vehicleId: [null, [Validators.required]],
      deliveryDate: [this.minDeliveryDate(), [Validators.required]]
    });
    this.loadOptions();
  }

  private loadOptions(): void {
    this.isLoadingOptions.set(true);

    // Only READY orders can be assigned a delivery
    this.customerOrderService.loadOrdersFiltered('READY', 0, 100).subscribe({
      next: () => {
        this.readyOrders.set(this.customerOrderService.orders());
        this.checkOptionsLoaded();
      },
      error: () => this.checkOptionsLoaded()
    });

    this.driverService.loadDrivers().subscribe({
      next: () => {
        this.drivers.set(this.driverService.drivers().filter(d => d.isAvailable !== false));
        this.checkOptionsLoaded();
      },
      error: () => this.checkOptionsLoaded()
    });

    this.vehicleService.loadVehicles(0, 100).subscribe({
      next: () => {
        this.vehicles.set(this.vehicleService.vehicles());
        this.checkOptionsLoaded();
      },
      error: () => this.checkOptionsLoaded()
    });

    // Resolve known driver ids from existing deliveries (backend gap workaround)
    this.deliveryService.loadDeliveries(0, 100).subscribe({
      next: () => {
        const ids = new Map<string, number>();
        this.deliveryService.deliveries().forEach(delivery => {
          ids.set(`${delivery.driver.name}|${delivery.driver.phone}`, delivery.driver.id);
        });
        this.driverIds.set(ids);
        this.checkOptionsLoaded();
      },
      error: () => this.checkOptionsLoaded()
    });
  }

  private loadedCount = 0;

  private checkOptionsLoaded(): void {
    this.loadedCount++;
    if (this.loadedCount >= 4) {
      this.isLoadingOptions.set(false);
      const presetOrderId = this.route.snapshot.queryParamMap.get('orderId');
      if (presetOrderId) {
        this.deliveryForm.get('orderId')?.setValue(+presetOrderId);
      }
    }
  }

  onSubmit(): void {
    if (this.deliveryForm.invalid) {
      this.deliveryForm.markAllAsTouched();
      this.notification.error('Validation Error', 'Select an order, driver, vehicle and a future delivery date');
      return;
    }

    this.isSubmitting.set(true);
    const { orderId, driverId, vehicleId, deliveryDate } = this.deliveryForm.value;
    const payload: DeliveryRequest = {
      orderId: +orderId,
      driverId: +driverId,
      vehicleId: +vehicleId,
      deliveryDate
    };

    this.deliveryService.createDelivery(payload).subscribe({
      next: (delivery) => {
        this.notification.success('Success', `Delivery #${delivery.id} scheduled`);
        this.isSubmitting.set(false);
        this.router.navigate(['/delivery/deliveries', delivery.id]);
      },
      error: (error) => {
        console.error('Error scheduling delivery:', error);
        this.notification.error('Error', ErrorHandler.getCompleteErrorMessage(error));
        this.isSubmitting.set(false);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.deliveryForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private addDays(date: Date, days: number): Date {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
  }

  private toDateInputValue(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
