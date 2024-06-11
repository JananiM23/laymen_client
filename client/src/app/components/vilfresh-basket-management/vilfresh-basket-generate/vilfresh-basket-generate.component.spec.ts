/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VilfreshBasketGenerateComponent } from './vilfresh-basket-generate.component';

describe('VilfreshBasketGenerateComponent', () => {
  let component: VilfreshBasketGenerateComponent;
  let fixture: ComponentFixture<VilfreshBasketGenerateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VilfreshBasketGenerateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VilfreshBasketGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
