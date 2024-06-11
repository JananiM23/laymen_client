import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeliverylineManagementComponent } from './modal-deliveryline-management.component';

describe('ModalDeliverylineManagementComponent', () => {
  let component: ModalDeliverylineManagementComponent;
  let fixture: ComponentFixture<ModalDeliverylineManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDeliverylineManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeliverylineManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
