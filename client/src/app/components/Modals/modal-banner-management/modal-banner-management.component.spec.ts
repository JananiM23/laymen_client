import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBannerManagementComponent } from './modal-banner-management.component';

describe('ModalBannerManagementComponent', () => {
  let component: ModalBannerManagementComponent;
  let fixture: ComponentFixture<ModalBannerManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBannerManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBannerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
