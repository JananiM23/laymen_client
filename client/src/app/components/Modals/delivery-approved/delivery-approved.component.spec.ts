import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryApprovedComponent } from './delivery-approved.component';

describe('DeliveryApprovedComponent', () => {
  let component: DeliveryApprovedComponent;
  let fixture: ComponentFixture<DeliveryApprovedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryApprovedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
