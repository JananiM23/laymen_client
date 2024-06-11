/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VilfreshBasketService } from './vilfresh-basket.service';

describe('Service: VilfreshBasket', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VilfreshBasketService]
    });
  });

  it('should ...', inject([VilfreshBasketService], (service: VilfreshBasketService) => {
    expect(service).toBeTruthy();
  }));
});
