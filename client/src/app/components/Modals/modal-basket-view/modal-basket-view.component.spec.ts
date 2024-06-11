import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBasketViewComponent } from './modal-basket-view.component';

describe('ModalBasketViewComponent', () => {
  let component: ModalBasketViewComponent;
  let fixture: ComponentFixture<ModalBasketViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBasketViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBasketViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
