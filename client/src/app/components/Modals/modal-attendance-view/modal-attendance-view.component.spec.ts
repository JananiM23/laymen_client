import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAttendanceViewComponent } from './modal-attendance-view.component';

describe('ModalAttendanceViewComponent', () => {
  let component: ModalAttendanceViewComponent;
  let fixture: ComponentFixture<ModalAttendanceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAttendanceViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAttendanceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
