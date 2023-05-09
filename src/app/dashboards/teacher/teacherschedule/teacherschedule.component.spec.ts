import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherscheduleComponent } from './teacherschedule.component';

describe('TeacherscheduleComponent', () => {
  let component: TeacherscheduleComponent;
  let fixture: ComponentFixture<TeacherscheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherscheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherscheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
