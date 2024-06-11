import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryboyRecordsComponent } from './deliveryboy-records.component';

describe('DeliveryboyRecordsComponent', () => {
  let component: DeliveryboyRecordsComponent;
  let fixture: ComponentFixture<DeliveryboyRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryboyRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryboyRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
