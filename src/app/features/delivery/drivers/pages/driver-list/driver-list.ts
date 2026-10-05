import {AfterViewInit, Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DriverService} from '../../services/driver.service';
import {DriverResponse} from '../../models/driver.model';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { DataTableComponent, TableColumn } from '../../../../../shared/components/data-table/data-table.component';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-driver-list',
  imports: [PageHeaderComponent, DataTableComponent, StatusBadgeComponent],
  templateUrl: './driver-list.html',
  styleUrl: './driver-list.css',
})
export class DriverList implements OnInit, AfterViewInit {

  private driverService: DriverService = inject(DriverService);

  drivers = this.driverService.drivers;
  isLoading = this.driverService.isLoading;

  @ViewChild('availabilityTpl') availabilityTpl!: TemplateRef<unknown>;

  // Table columns configuration (template-bound in ngAfterViewInit)
  columns: TableColumn[] = [];

  // Track by function for performance (backend returns no id, use licenseNumber)
  trackByDriver = (driver: DriverResponse) => driver.licenseNumber;

  ngOnInit(): void {
    this.loadDrivers();
  }

  ngAfterViewInit(): void {
    this.columns = [
      { key: 'name', label: 'Driver Name', type: 'text' },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'licenseNumber', label: 'License Number', type: 'text' },
      { key: 'isAvailable', label: 'Availability', type: 'custom', align: 'center', width: '160px', template: this.availabilityTpl }
    ];
  }

  loadDrivers(): void {
    this.driverService.loadDrivers().subscribe();

    console.log("Data fetched: ", this.drivers);
  }
}
