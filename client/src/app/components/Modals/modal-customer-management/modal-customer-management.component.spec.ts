import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCustomerManagementComponent } from './modal-customer-management.component';

describe('ModalCustomerManagementComponent', () => {
  let component: ModalCustomerManagementComponent;
  let fixture: ComponentFixture<ModalCustomerManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCustomerManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCustomerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
