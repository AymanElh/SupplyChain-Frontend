import { TestBed } from '@angular/core/testing';

import { SupplierOrderApiService } from './supplier-order-api-service';

describe('SupplierOrderApiService', () => {
  let service: SupplierOrderApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierOrderApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
