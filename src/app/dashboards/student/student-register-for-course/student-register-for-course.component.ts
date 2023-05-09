import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/AuthService';
import { Toast } from 'bootstrap';
import { Assignment, Course, Submission, ForgotPasswordResponse, CourseMaterial, LoginRequest, User } from 'src/app/models/allModels';

@Component({
  selector: 'app-student-register-for-course',
  templateUrl: './student-register-for-course.component.html',
  styleUrls: ['./student-register-for-course.component.css']
})
export class StudentRegisterForCourseComponent implements OnInit {
  courseList!: Course[];
  currentemail!: any;
  successMessage: any;
  errorMessage: string | undefined;

  constructor(private AuthService: AuthService) { }

  ngOnInit(): void {
    // Call the showAvailableCoursesForStudent method and subscribe to the results
    this.AuthService.showAvailableCoursesForStudent().subscribe(courses => {
      this.courseList = courses;
    });
  }

  register(courseID: any) {
    const email = localStorage.getItem('email');
    this.currentemail = email;
    this.AuthService.registerForCourse(courseID, this.currentemail).subscribe(result => {
      if (result) {
        // Course registration successful
        window.location.reload();
        this.errorMessage = '';
        this.successMessage = 'Course registration successful!';
      } else {
        // Course registration failed
        this.errorMessage = 'Could not register for course.';
        this.successMessage = '';
      }
    });
  }
  showLiveToast() {
    const liveToastEl = document.getElementById('liveToast');
    if (liveToastEl) {
      const liveToast = new Toast(liveToastEl);
      liveToast.show();
    }
  }
}
