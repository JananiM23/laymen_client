import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCustomerViewComponent } from './modal-customer-view.component';

describe('ModalCustomerViewComponent', () => {
  let component: ModalCustomerViewComponent;
  let fixture: ComponentFixture<ModalCustomerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCustomerViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCustomerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
