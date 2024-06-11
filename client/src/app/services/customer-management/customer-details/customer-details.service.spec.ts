import { TestBed } from '@angular/core/testing';

import { CustomerDetailsService } from './customer-details.service';

describe('CustomerDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomerDetailsService = TestBed.get(CustomerDetailsService);
    expect(service).toBeTruthy();
  });
});
