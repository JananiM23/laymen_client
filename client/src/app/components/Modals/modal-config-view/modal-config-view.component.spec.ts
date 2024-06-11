import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfigViewComponent } from './modal-config-view.component';

describe('ModalConfigViewComponent', () => {
  let component: ModalConfigViewComponent;
  let fixture: ComponentFixture<ModalConfigViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfigViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfigViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
