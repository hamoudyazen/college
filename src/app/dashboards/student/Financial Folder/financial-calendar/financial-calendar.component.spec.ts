import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialCalendarComponent } from './financial-calendar.component';

describe('FinancialCalendarComponent', () => {
  let component: FinancialCalendarComponent;
  let fixture: ComponentFixture<FinancialCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinancialCalendarComponent]
    });
    fixture = TestBed.createComponent(FinancialCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
