import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSupportsComponent } from './customer-supports.component';

describe('CustomerSupportsComponent', () => {
  let component: CustomerSupportsComponent;
  let fixture: ComponentFixture<CustomerSupportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerSupportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSupportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
