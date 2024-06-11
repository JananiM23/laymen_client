import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyCollectionsComponent } from './daily-collections.component';

describe('DailyCollectionsComponent', () => {
  let component: DailyCollectionsComponent;
  let fixture: ComponentFixture<DailyCollectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyCollectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
