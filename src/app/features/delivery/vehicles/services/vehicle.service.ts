import {Injectable, signal} from '@angular/core';
import {VehicleApiService} from './vehicle-api.service';
import {Observable, tap} from 'rxjs';
import {VehicleRequest, VehicleResponse} from '../models/vehicle.model';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {

  constructor(
    private api: VehicleApiService
  ) {
  }

  vehicles = signal<VehicleResponse[]>([]);
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  totalElements = signal<number>(0);
  isLoading = signal<boolean>(false);

  loadVehicles(page: number = 0, size: number = 10, sort: string = 'id') {
    this.isLoading.set(true);
    return this.api.getAll(page, size, sort).pipe(
      tap({
        next: (response) => {
          console.log(response);
          this.vehicles.set(response.content);
          this.currentPage.set(response.number);
          this.totalPages.set(response.totalPages);
          this.totalElements.set(response.totalElements);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      })
    )
  }

  getVehicle(id: number) {
    return this.api.getById(id);
  }

  createVehicle(vehicle: VehicleRequest) {
    return this.api.create(vehicle).pipe(
      tap({
        next: (newVehicle) => {
          this.vehicles.update(curr => [...curr, newVehicle]);
        }
      })
    );
  }

  updateVehicle(id: number, vehicle: VehicleRequest): Observable<VehicleResponse> {
    console.log("Update vehicle is not available yet");
    return this.api.update(id, vehicle);
  }

  deleteVehicle(id: number) {
    return this.api.delete(id).pipe(
      tap({
        next: () => {
          this.vehicles.update(current => current.filter(v => v.id !== id));
        }
      })
    );
  }
}
