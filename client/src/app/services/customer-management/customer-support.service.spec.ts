import { TestBed } from '@angular/core/testing';

import { CustomerSupportService } from './customer-support.service';

describe('CustomerSupportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomerSupportService = TestBed.get(CustomerSupportService);
    expect(service).toBeTruthy();
  });
});
