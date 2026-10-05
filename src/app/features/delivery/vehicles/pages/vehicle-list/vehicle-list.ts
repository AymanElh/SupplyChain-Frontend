import {Component, inject, OnInit, signal} from '@angular/core';
import {VehicleService} from '../../services/vehicle.service';
import {VehicleResponse} from '../../models/vehicle.model';
import {Router} from '@angular/router';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { DataTableComponent, TableColumn, TableAction } from '../../../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-vehicle-list',
  imports: [PageHeaderComponent, DataTableComponent],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.css',
})
export class VehicleList implements OnInit {

  private vehicleService: VehicleService = inject(VehicleService);
  private router: Router = inject(Router);

  searchQuery = signal<string>('');
  pageSize = signal<number>(10);
  sort = signal<string>('id');

  vehicles = this.vehicleService.vehicles;
  isLoading = this.vehicleService.isLoading;
  currentPage = this.vehicleService.currentPage;
  totalPages = this.vehicleService.totalPages;

  // Table columns configuration
  columns: TableColumn[] = [
    { key: 'id', label: '#', type: 'number', width: '80px' },
    { key: 'licensePlate', label: 'License Plate', type: 'text' },
    { key: 'type', label: 'Type', type: 'text' },
    { key: 'model', label: 'Model', type: 'text' }
  ];

  // Table actions configuration
  actions: TableAction[] = [
    {
      label: 'View',
      color: 'blue',
      action: (vehicle: VehicleResponse) => this.router.navigate(['/delivery/vehicles', vehicle.id])
    },
    {
      label: 'Edit',
      color: 'yellow',
      action: (vehicle: VehicleResponse) => this.router.navigate(['/delivery/vehicles', vehicle.id, 'edit'])
    },
    {
      label: 'Delete',
      color: 'red',
      action: (vehicle: VehicleResponse) => this.onDelete(vehicle)
    }
  ];

  // Track by function for performance
  trackByVehicle = (vehicle: VehicleResponse) => vehicle.id;

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.vehicleService.loadVehicles(
      this.currentPage(),
      this.pageSize(),
      this.sort()
    ).subscribe();

    console.log("Data fetched: ", this.vehicles);
  }

  onDelete(vehicle: VehicleResponse) {
    if (confirm(`Are you sure you want to delete this vehicle ${vehicle.licensePlate}?`)) {
      this.vehicleService.deleteVehicle(vehicle.id).subscribe({
        next: () => {
          this.loadVehicles();
        }
      });
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.vehicleService.loadVehicles(
        this.currentPage() + 1,
        this.pageSize()
      ).subscribe();
    }
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.vehicleService.loadVehicles(
        this.currentPage() - 1,
        this.pageSize()
      ).subscribe();
    }
  }

  goToPage(page: number): void {
    this.vehicleService.loadVehicles(page, this.pageSize()).subscribe();
  }
}
