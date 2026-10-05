import { TestBed } from '@angular/core/testing';

import { DriverApiService } from './driver-api.service';
import { DriverService } from './driver.service';

describe('DriverApiService', () => {
  let service: DriverApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('DriverService', () => {
  let service: DriverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to an empty drivers list', () => {
    expect(service.drivers()).toEqual([]);
  });
});
