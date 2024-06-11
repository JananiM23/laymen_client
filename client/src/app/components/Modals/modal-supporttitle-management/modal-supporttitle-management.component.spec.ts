import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSupporttitleManagementComponent } from './modal-supporttitle-management.component';

describe('ModalSupporttitleManagementComponent', () => {
  let component: ModalSupporttitleManagementComponent;
  let fixture: ComponentFixture<ModalSupporttitleManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSupporttitleManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSupporttitleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
