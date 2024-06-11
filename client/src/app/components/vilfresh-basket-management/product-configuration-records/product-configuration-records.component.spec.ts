import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductConfigurationRecordsComponent } from './product-configuration-records.component';

describe('ProductConfigurationRecordsComponent', () => {
  let component: ProductConfigurationRecordsComponent;
  let fixture: ComponentFixture<ProductConfigurationRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductConfigurationRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductConfigurationRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
