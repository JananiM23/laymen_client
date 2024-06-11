import { TestBed } from '@angular/core/testing';

import { CreditDetailsService } from './credit-details.service';

describe('CreditDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreditDetailsService = TestBed.get(CreditDetailsService);
    expect(service).toBeTruthy();
  });
});
