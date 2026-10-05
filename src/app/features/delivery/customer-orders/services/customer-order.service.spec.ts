import { TestBed } from '@angular/core/testing';

import { CustomerOrderApiService } from './customer-order-api.service';
import { CustomerOrderService } from './customer-order.service';

describe('CustomerOrderApiService', () => {
  let service: CustomerOrderApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerOrderApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('CustomerOrderService', () => {
  let service: CustomerOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to the PENDING filter', () => {
    expect(service.filterStatus()).toBe('PENDING');
  });
});
