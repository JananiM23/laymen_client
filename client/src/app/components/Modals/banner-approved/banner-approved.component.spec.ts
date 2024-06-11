import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerApprovedComponent } from './banner-approved.component';

describe('BannerApprovedComponent', () => {
  let component: BannerApprovedComponent;
  let fixture: ComponentFixture<BannerApprovedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerApprovedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
