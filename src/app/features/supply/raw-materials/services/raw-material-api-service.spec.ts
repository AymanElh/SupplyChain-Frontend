import { TestBed } from '@angular/core/testing';

import { RawMaterialApiService } from './raw-material-api-service';

describe('RawMaterialApiService', () => {
  let service: RawMaterialApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RawMaterialApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
