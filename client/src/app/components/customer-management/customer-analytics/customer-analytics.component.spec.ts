import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAnalyticsComponent } from './customer-analytics.component';

describe('CustomerAnalyticsComponent', () => {
  let component: CustomerAnalyticsComponent;
  let fixture: ComponentFixture<CustomerAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
