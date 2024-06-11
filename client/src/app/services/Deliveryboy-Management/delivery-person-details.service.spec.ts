import { TestBed } from '@angular/core/testing';

import { DeliveryPersonDetailsService } from './delivery-person-details.service';

describe('DeliveryPersonDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeliveryPersonDetailsService = TestBed.get(DeliveryPersonDetailsService);
    expect(service).toBeTruthy();
  });
});
