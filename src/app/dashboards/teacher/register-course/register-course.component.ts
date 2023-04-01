import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/AuthService';
import { Course } from 'src/app/Course';

@Component({
  selector: 'app-register-course',
  templateUrl: './register-course.component.html',
  styleUrls: ['./register-course.component.css']
})
export class RegisterCourseComponent implements OnInit {
  id: string | undefined;
  errorMessage: string | undefined;
  successMessage: string | undefined;

  course: Course = {
    capacity: '20',
    credits: '',
    description: '',
    duration: '',
    name: '',
    teacherID: '',
    studentsArray: [],
    semester: ''
  };

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    //to call the getName function
    const email = localStorage.getItem('email');
    console.log('email', email);
    if (email) {
      this.authService.getID(email).subscribe(
        response => this.id = response.id,
        error => console.log('Failed to get teacher id:', error)
      );
    }
  } onSubmit(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.authService.getID(email).subscribe(
        response => {
          this.id = response.id;
          // Set the teacherID field to the ID of the logged-in user, if available
          if (this.id !== undefined) {
            this.course.teacherID = this.id;
          }
          this.authService.registerCourse(this.course).subscribe(
            () => {
              console.log('registration completed successfully');
              alert('register complete ')
              this.successMessage = 'Courses added successfully';
            },
            (error) => {
              if (error.error && error.error.message && error.error.message === 'User Already Exist') {
                this.errorMessage = 'User with this email already exist';
              }
              else if (error.error && error.error.message && error.error.message === 'Password Short') {
                this.errorMessage = 'Password Short';
              }
              else {
                this.errorMessage = 'An error occurred during registration, Please try again later..';
              }
            }
          );
        },
        error => console.log('Failed to get teacher id:', error)
      );
    }
  }
}
