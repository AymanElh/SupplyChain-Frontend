import { TestBed } from '@angular/core/testing';

import { VehicleApiService } from './vehicle-api.service';
import { VehicleService } from './vehicle.service';

describe('VehicleApiService', () => {
  let service: VehicleApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('VehicleService', () => {
  let service: VehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to the first page', () => {
    expect(service.currentPage()).toBe(0);
  });
});
