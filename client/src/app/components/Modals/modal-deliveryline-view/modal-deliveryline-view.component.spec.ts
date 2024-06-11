import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeliverylineViewComponent } from './modal-deliveryline-view.component';

describe('ModalDeliverylineViewComponent', () => {
  let component: ModalDeliverylineViewComponent;
  let fixture: ComponentFixture<ModalDeliverylineViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDeliverylineViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeliverylineViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
