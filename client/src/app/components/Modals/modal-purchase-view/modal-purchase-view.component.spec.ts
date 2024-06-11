import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPurchaseViewComponent } from './modal-purchase-view.component';

describe('ModalPurchaseViewComponent', () => {
  let component: ModalPurchaseViewComponent;
  let fixture: ComponentFixture<ModalPurchaseViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPurchaseViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPurchaseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
