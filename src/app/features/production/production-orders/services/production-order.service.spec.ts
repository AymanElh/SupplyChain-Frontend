import { TestBed } from '@angular/core/testing';

import { ProductionOrderApiService } from './production-order-api.service';
import { ProductionOrderService } from './production-order.service';

describe('ProductionOrderApiService', () => {
  let service: ProductionOrderApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionOrderApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('ProductionOrderService', () => {
  let service: ProductionOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to the ALL filter', () => {
    expect(service.filterStatus()).toBe('ALL');
  });
});
