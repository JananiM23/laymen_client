import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSupportTitleComponent } from './customer-support-title.component';

describe('CustomerSupportTitleComponent', () => {
  let component: CustomerSupportTitleComponent;
  let fixture: ComponentFixture<CustomerSupportTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerSupportTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSupportTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
