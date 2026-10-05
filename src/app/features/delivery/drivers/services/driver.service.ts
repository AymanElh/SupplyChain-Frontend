import {Injectable, signal} from '@angular/core';
import {DriverApiService} from './driver-api.service';
import {Observable, tap} from 'rxjs';
import {DriverRequest, DriverResponse} from '../models/driver.model';

@Injectable({
  providedIn: 'root',
})
export class DriverService {

  constructor(
    private api: DriverApiService
  ) {
  }

  drivers = signal<DriverResponse[]>([]);
  isLoading = signal<boolean>(false);

  loadDrivers() {
    this.isLoading.set(true);
    return this.api.getAll().pipe(
      tap({
        next: (response) => {
          console.log(response);
          this.drivers.set(response);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      })
    )
  }

  getDriver(id: number) {
    return this.api.getById(id);
  }

  createDriver(driver: DriverRequest) {
    return this.api.create(driver).pipe(
      tap({
        next: (newDriver) => {
          this.drivers.update(curr => [...curr, newDriver]);
        }
      })
    );
  }

  updateDriver(id: number, driver: DriverRequest): Observable<DriverResponse> {
    console.log("Update driver is not available yet");
    return this.api.update(id, driver);
  }

  deleteDriver(id: number) {
    return this.api.delete(id);
  }
}
