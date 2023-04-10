import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentcoursesComponent } from './studentcourses.component';

describe('StudentcoursesComponent', () => {
  let component: StudentcoursesComponent;
  let fixture: ComponentFixture<StudentcoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentcoursesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentcoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
