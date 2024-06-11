import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRecordsComponent } from './order-records.component';

describe('OrderRecordsComponent', () => {
  let component: OrderRecordsComponent;
  let fixture: ComponentFixture<OrderRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
