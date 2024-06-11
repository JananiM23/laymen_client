import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCollectionApproveComponent } from './modal-collection-approve.component';

describe('ModalCollectionApproveComponent', () => {
  let component: ModalCollectionApproveComponent;
  let fixture: ComponentFixture<ModalCollectionApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCollectionApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCollectionApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
