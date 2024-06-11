import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseRecordsComponent } from './purchase-records.component';

describe('PurchaseRecordsComponent', () => {
  let component: PurchaseRecordsComponent;
  let fixture: ComponentFixture<PurchaseRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
