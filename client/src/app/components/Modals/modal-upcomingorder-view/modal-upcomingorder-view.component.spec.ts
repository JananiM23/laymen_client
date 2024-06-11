import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUpcomingorderViewComponent } from './modal-upcomingorder-view.component';

describe('ModalUpcomingorderViewComponent', () => {
  let component: ModalUpcomingorderViewComponent;
  let fixture: ComponentFixture<ModalUpcomingorderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalUpcomingorderViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUpcomingorderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
