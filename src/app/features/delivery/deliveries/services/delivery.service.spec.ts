import { TestBed } from '@angular/core/testing';

import { DeliveryApiService } from './delivery-api.service';
import { DeliveryService } from './delivery.service';

describe('DeliveryApiService', () => {
  let service: DeliveryApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('DeliveryService', () => {
  let service: DeliveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
