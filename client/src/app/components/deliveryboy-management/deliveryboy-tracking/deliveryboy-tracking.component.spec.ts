import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryboyTrackingComponent } from './deliveryboy-tracking.component';

describe('DeliveryboyTrackingComponent', () => {
  let component: DeliveryboyTrackingComponent;
  let fixture: ComponentFixture<DeliveryboyTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryboyTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryboyTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
