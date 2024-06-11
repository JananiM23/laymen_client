import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerRecordsComponent } from './banner-records.component';

describe('BannerRecordsComponent', () => {
  let component: BannerRecordsComponent;
  let fixture: ComponentFixture<BannerRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
