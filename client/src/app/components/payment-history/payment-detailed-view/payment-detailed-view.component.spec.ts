import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailedViewComponent } from './payment-detailed-view.component';

describe('PaymentDetailedViewComponent', () => {
  let component: PaymentDetailedViewComponent;
  let fixture: ComponentFixture<PaymentDetailedViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentDetailedViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDetailedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
