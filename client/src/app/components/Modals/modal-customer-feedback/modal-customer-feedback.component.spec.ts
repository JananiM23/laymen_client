import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCustomerFeedbackComponent } from './modal-customer-feedback.component';

describe('ModalCustomerFeedbackComponent', () => {
  let component: ModalCustomerFeedbackComponent;
  let fixture: ComponentFixture<ModalCustomerFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCustomerFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCustomerFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
