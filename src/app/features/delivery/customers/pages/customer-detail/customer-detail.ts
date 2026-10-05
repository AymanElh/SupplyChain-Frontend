import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer.service';
import { AddressRequest, CustomerResponse } from '../../models/customer.model';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { HasRoleDirective } from '../../../../../shared/directives/has-role.directive';
import { UserRole } from '../../../../../core/models/user-roles';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ErrorHandler } from '../../../../../core/utils/error-handler';

@Component({
  selector: 'app-customer-detail',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent, HasRoleDirective],
  templateUrl: './customer-detail.html'
})
export class CustomerDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private customerService = inject(CustomerService);
  private notification = inject(NotificationService);
  private fb = inject(FormBuilder);

  protected readonly UserRole = UserRole;

  customer = signal<CustomerResponse | null>(null);
  isLoading = signal<boolean>(true);
  showAddressForm = signal<boolean>(false);
  isAddingAddress = signal<boolean>(false);

  addressForm: FormGroup = this.fb.group({
    street: ['', [Validators.required]],
    city: ['', [Validators.required]],
    region: ['', [Validators.required]],
    postalCode: ['', [Validators.required]],
    country: ['', [Validators.required]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCustomer(+id);
    }
  }

  loadCustomer(id: number): void {
    this.isLoading.set(true);
    this.customerService.getCustomer(id).subscribe({
      next: (customer) => {
        this.customer.set(customer);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading customer:', error);
        this.notification.error('Error', ErrorHandler.getCompleteErrorMessage(error));
        this.isLoading.set(false);
        this.router.navigate(['/delivery/customers']);
      }
    });
  }

  onDelete(): void {
    const customer = this.customer();
    if (!customer) return;
    if (confirm(`Are you sure you want to delete customer ${customer.name}?`)) {
      this.customerService.deleteCustomer(customer.id).subscribe({
        next: () => {
          this.notification.success('Success', 'Customer deleted');
          this.router.navigate(['/delivery/customers']);
        },
        error: (error) => {
          console.error('Error deleting customer:', error);
          this.notification.error('Error', ErrorHandler.getCompleteErrorMessage(error));
        }
      });
    }
  }

  onAddAddress(): void {
    const customer = this.customer();
    if (!customer || this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    this.isAddingAddress.set(true);
    const address: AddressRequest = this.addressForm.value;
    this.customerService.addAddress(customer.id, address).subscribe({
      next: (updated) => {
        this.customer.set(updated);
        this.notification.success('Success', 'Address added');
        this.addressForm.reset();
        this.showAddressForm.set(false);
        this.isAddingAddress.set(false);
      },
      error: (error) => {
        console.error('Error adding address:', error);
        this.notification.error('Error', ErrorHandler.getCompleteErrorMessage(error));
        this.isAddingAddress.set(false);
      }
    });
  }
}
