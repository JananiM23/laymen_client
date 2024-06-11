import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeliverypersonManagementComponent } from './modal-deliveryperson-management.component';

describe('ModalDeliverypersonManagementComponent', () => {
  let component: ModalDeliverypersonManagementComponent;
  let fixture: ComponentFixture<ModalDeliverypersonManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDeliverypersonManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeliverypersonManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
