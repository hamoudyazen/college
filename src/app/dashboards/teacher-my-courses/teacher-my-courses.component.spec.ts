import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherMyCoursesComponent } from './teacher-my-courses.component';

describe('TeacherMyCoursesComponent', () => {
  let component: TeacherMyCoursesComponent;
  let fixture: ComponentFixture<TeacherMyCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherMyCoursesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherMyCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
