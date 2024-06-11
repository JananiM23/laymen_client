import { TestBed } from '@angular/core/testing';

import { NotificationManagementService } from './notification-management.service';

describe('NotificationManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationManagementService = TestBed.get(NotificationManagementService);
    expect(service).toBeTruthy();
  });
});
