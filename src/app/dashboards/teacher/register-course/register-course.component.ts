import { Component, OnInit } from '@angular/core';
import { Alert, Toast } from 'bootstrap';
import { AuthService } from 'src/app/services/AuthService';
import { Assignment, Course, Submission, ForgotPasswordResponse, CourseMaterial, LoginRequest, User } from 'src/app/models/allModels';

@Component({
  selector: 'app-register-course',
  templateUrl: './register-course.component.html',
  styleUrls: ['./register-course.component.css']
})
export class RegisterCourseComponent implements OnInit {
  id: any;
  major: any;
  semester: any;
  date!: Date;
  userDetails: User[] = [];
  userDetailsStorage: User[] = [];

  course: Course = {
    capacity: 20,
    credits: 0,
    description: '',
    semesterHours: 0,
    name: '',
    teacherID: '',
    studentsArray: [],
    semester: "",
    major: ''
  };

  constructor(private authService: AuthService) { }
  ngOnInit(): void {
    const userDetailsStorage = JSON.parse(localStorage.getItem('userDetails') || '{}');
    this.id = userDetailsStorage.id;
    this.major = userDetailsStorage.major;
    this.userDetails = Object.values(userDetailsStorage);

    const date = new Date();
    const month = date.getMonth() + 1; // get current month (Jan is 0, Dec is 11)

    if (month >= 10 || month < 4) {
      this.semester = "winter";
    } else {
      this.semester = "summer";
    }
  }



  onSubmit(): void {
    this.course.teacherID = this.id;
    this.course.major = this.major;
    this.course.semester = this.semester;
    this.authService.registerCourse(this.course).subscribe(
      response => {
        alert('added successfully');
      },
      error => {
        alert('error');
      }
    );
  }

  checkSemesterHours(input: any) {
    if (input.value >= 5) {
      input.value = 5;
    }
    else if (input.value <= 0) {
      input.value = 1;
    }
  }

}
