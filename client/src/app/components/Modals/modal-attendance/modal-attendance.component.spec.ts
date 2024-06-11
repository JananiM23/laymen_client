import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAttendanceComponent } from './modal-attendance.component';

describe('ModalAttendanceComponent', () => {
  let component: ModalAttendanceComponent;
  let fixture: ComponentFixture<ModalAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
