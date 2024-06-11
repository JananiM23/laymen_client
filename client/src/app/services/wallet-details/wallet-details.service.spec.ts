import { TestBed } from '@angular/core/testing';

import { WalletDetailsService } from './wallet-details.service';

describe('WalletDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WalletDetailsService = TestBed.get(WalletDetailsService);
    expect(service).toBeTruthy();
  });
});
