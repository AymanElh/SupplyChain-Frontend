import { TestBed } from '@angular/core/testing';

import { RoleApiService } from './role-api.service';
import { RoleService } from './role.service';

describe('RoleApiService', () => {
  let service: RoleApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('RoleService', () => {
  let service: RoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
