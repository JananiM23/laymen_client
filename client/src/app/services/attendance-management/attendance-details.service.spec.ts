import { TestBed } from '@angular/core/testing';

import { AttendanceDetailsService } from './attendance-details.service';

describe('AttendanceDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AttendanceDetailsService = TestBed.get(AttendanceDetailsService);
    expect(service).toBeTruthy();
  });
});
