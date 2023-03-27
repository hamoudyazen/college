import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/AuthService';
import { Course } from 'src/app/Course';

@Component({
  selector: 'app-register-course',
  templateUrl: './register-course.component.html',
  styleUrls: ['./register-course.component.css']
})
export class RegisterCourseComponent implements OnInit {

  course: Course = {
    capacity: '',
    credits: '',
    description: '',
    duration: '',
    name: '',
    teacher: '',
    studentsArray: []
  };

  constructor(private courseService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.courseService.addCourse(this.course).subscribe(
      response => console.log('Course added successfully'),
      error => console.log('Failed to add course')
    );
  }

}
