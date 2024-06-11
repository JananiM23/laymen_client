import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletRecordsComponent } from './wallet-records.component';

describe('WalletRecordsComponent', () => {
  let component: WalletRecordsComponent;
  let fixture: ComponentFixture<WalletRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
