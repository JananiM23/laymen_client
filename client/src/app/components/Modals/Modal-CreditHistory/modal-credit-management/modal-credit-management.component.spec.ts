import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreditManagementComponent } from './modal-credit-management.component';

describe('ModalCreditManagementComponent', () => {
  let component: ModalCreditManagementComponent;
  let fixture: ComponentFixture<ModalCreditManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCreditManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreditManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
