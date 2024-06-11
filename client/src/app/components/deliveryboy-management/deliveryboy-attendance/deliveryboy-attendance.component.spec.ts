import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryboyAttendanceComponent } from './deliveryboy-attendance.component';

describe('DeliveryboyAttendanceComponent', () => {
  let component: DeliveryboyAttendanceComponent;
  let fixture: ComponentFixture<DeliveryboyAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryboyAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryboyAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
