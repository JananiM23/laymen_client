import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPurchaseAlertComponent } from './modal-purchase-alert.component';

describe('ModalPurchaseAlertComponent', () => {
  let component: ModalPurchaseAlertComponent;
  let fixture: ComponentFixture<ModalPurchaseAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPurchaseAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPurchaseAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
