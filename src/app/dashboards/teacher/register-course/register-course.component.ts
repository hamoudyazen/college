import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/AuthService';
import { Course } from 'src/app/courses';

@Component({
  selector: 'app-register-course',
  templateUrl: './register-course.component.html',
  styleUrls: ['./register-course.component.css']
})
export class RegisterCourseComponent implements OnInit {
  course: Course = {
    course_name: '',
    course_description: '',
    course_teacher: '',
    course_start_date: '',
    course_duration: '',
    course_credits: '',
    course_capacity: '',
    students_array: []

  };

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.authService.addCourse(this.course).subscribe(
      response => {
        console.log('Course added successfully:', response);
        // do something on success
      },
      error => {
        console.log('Error adding course:', error);
        // do something on error
      }
    );
  }
}
