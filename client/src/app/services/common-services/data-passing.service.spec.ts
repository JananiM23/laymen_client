/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DataPassingService } from './data-passing.service';

describe('Service: DataPassing', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataPassingService]
    });
  });

  it('should ...', inject([DataPassingService], (service: DataPassingService) => {
    expect(service).toBeTruthy();
  }));
});
