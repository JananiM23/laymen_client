import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCustomerSupportComponent } from './modal-customer-support.component';

describe('ModalCustomerSupportComponent', () => {
  let component: ModalCustomerSupportComponent;
  let fixture: ComponentFixture<ModalCustomerSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCustomerSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCustomerSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
