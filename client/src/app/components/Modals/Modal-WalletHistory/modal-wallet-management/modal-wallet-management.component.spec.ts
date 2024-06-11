import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWalletManagementComponent } from './modal-wallet-management.component';

describe('ModalWalletManagementComponent', () => {
  let component: ModalWalletManagementComponent;
  let fixture: ComponentFixture<ModalWalletManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalWalletManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalWalletManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
