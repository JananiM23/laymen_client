import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCurrentorderViewComponent } from './modal-currentorder-view.component';

describe('ModalCurrentorderViewComponent', () => {
  let component: ModalCurrentorderViewComponent;
  let fixture: ComponentFixture<ModalCurrentorderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCurrentorderViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCurrentorderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
