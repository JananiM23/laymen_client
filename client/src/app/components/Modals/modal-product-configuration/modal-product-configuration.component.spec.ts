import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProductConfigurationComponent } from './modal-product-configuration.component';

describe('ModalProductConfigurationComponent', () => {
  let component: ModalProductConfigurationComponent;
  let fixture: ComponentFixture<ModalProductConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalProductConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalProductConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
