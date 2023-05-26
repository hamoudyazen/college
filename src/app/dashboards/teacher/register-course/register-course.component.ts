import { Component, OnInit } from '@angular/core';
import { Alert, Toast } from 'bootstrap';
import { AuthService } from 'src/app/services/AuthService';
import { Assignment, Course, Submission, ForgotPasswordResponse, CourseMaterial, LoginRequest, User } from 'src/app/models/allModels';
import { SharedService } from 'src/app/services/SharedService';

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
  currentEmail: any;
  course: Course = {
    id: '',
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

  constructor(private authService: AuthService, private sharedService: SharedService) { }
  async ngOnInit(): Promise<void> {
    try {
      this.userDetails = await this.sharedService.getUserDetails(); // Assign the resolved value to teacherCourses
      this.userDetails = this.sharedService.userDetails;
      this.id = this.sharedService.id;
      this.major = this.sharedService.major;
      this.semester = this.sharedService.semester;
    } catch (error) {
      console.error('Error retrieving data:', error);
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
