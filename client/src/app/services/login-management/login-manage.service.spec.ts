import { TestBed } from '@angular/core/testing';

import { LoginManageService } from './login-manage.service';

describe('LoginManageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoginManageService = TestBed.get(LoginManageService);
    expect(service).toBeTruthy();
  });
});
