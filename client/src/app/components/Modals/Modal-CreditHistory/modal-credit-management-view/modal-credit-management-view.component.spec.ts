import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreditManagementViewComponent } from './modal-credit-management-view.component';

describe('ModalCreditManagementViewComponent', () => {
  let component: ModalCreditManagementViewComponent;
  let fixture: ComponentFixture<ModalCreditManagementViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCreditManagementViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreditManagementViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
