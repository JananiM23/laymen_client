import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalExtraProductConfigurationComponent } from './modal-extra-product-configuration.component';

describe('ModalExtraProductConfigurationComponent', () => {
  let component: ModalExtraProductConfigurationComponent;
  let fixture: ComponentFixture<ModalExtraProductConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalExtraProductConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalExtraProductConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
