import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCustomerAnalyticsComponent } from './modal-customer-analytics.component';

describe('ModalCustomerAnalyticsComponent', () => {
  let component: ModalCustomerAnalyticsComponent;
  let fixture: ComponentFixture<ModalCustomerAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCustomerAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCustomerAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
