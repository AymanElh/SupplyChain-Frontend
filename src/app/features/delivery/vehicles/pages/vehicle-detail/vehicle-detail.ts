import {Component, inject, OnInit, signal} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {VehicleService} from '../../services/vehicle.service';
import {VehicleResponse} from '../../models/vehicle.model';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ErrorHandler } from '../../../../../core/utils/error-handler';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './vehicle-detail.html',
  styleUrl: './vehicle-detail.css',
})
export class VehicleDetail implements OnInit{

  private route = inject(ActivatedRoute);
  private router = inject(Router)
  private vehicleService = inject(VehicleService);
  private notificationService = inject(NotificationService);

  vehicle = signal<VehicleResponse | null>(null);
  isLoading = signal<boolean>(true);
  notFound = signal<boolean>(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadVehicle(+id);
    }
  }

  loadVehicle(id: number): void {
    this.vehicleService.getVehicle(id).subscribe({
      next: (vehicle) => {
        this.vehicle.set(vehicle);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.notificationService.error('Load Failed', ErrorHandler.getCompleteErrorMessage(error));
        this.isLoading.set(false);
        this.notFound.set(true);
      }
    })
  }

  onEdit(): void {
    const vehicle = this.vehicle();
    if (vehicle) {
      this.router.navigate(['/delivery/vehicles', vehicle.id, 'edit'])
    }
  }

  onDelete(): void {
    const vehicle = this.vehicle();
    if (!vehicle) return;

    if (confirm(`Are you sure you want to delete vehicle "${vehicle.licensePlate}"?`)) {
      this.vehicleService.deleteVehicle(vehicle.id).subscribe({
        next: () => {
          this.notificationService.success('Success', 'Vehicle deleted successfully');
          this.router.navigate(['/delivery/vehicles'])
        },
        error: (error) => {
          this.notificationService.error('Delete Failed', ErrorHandler.getCompleteErrorMessage(error));
        }
      })
    }
  }
}
