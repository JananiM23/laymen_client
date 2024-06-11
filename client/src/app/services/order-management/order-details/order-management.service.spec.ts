
import { TestBed, async, inject } from '@angular/core/testing';
import {OrderManagementService} from  './order-management.service';

describe('Service: OrderManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderManagementService]
    });
  });

  it('should ...', inject([OrderManagementService], (service: OrderManagementService) => {
    expect(service).toBeTruthy();
  }));
});