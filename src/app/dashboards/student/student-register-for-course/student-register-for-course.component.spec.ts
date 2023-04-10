import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentRegisterForCourseComponent } from './student-register-for-course.component';

describe('StudentRegisterForCourseComponent', () => {
  let component: StudentRegisterForCourseComponent;
  let fixture: ComponentFixture<StudentRegisterForCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentRegisterForCourseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentRegisterForCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
