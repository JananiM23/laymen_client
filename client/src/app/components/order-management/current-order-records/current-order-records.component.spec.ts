import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentOrderRecordsComponent } from './current-order-records.component';

describe('CurrentOrderRecordsComponent', () => {
  let component: CurrentOrderRecordsComponent;
  let fixture: ComponentFixture<CurrentOrderRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentOrderRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentOrderRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
