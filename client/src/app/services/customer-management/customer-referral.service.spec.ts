/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CustomerReferralService } from './customer-referral.service';

describe('Service: CustomerReferral', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerReferralService]
    });
  });

  it('should ...', inject([CustomerReferralService], (service: CustomerReferralService) => {
    expect(service).toBeTruthy();
  }));
});
