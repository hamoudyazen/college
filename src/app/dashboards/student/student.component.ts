import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService';
import { Input } from '@angular/core';
import { Assignment, Course, Submission, ForgotPasswordResponse, CourseMaterial, LoginRequest, User } from 'src/app/models/allModels';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  userDetails: User[] = [];
  navbarCollapsed = true;
  name: string | undefined;
  pagename: string = '';
  isSmallScreen!: boolean;
  showAssignments: boolean = false;
  showStudentCourses: boolean = true;
  showAllAvailableCourses: boolean = false;
  showProfile: boolean = false;
  activeLink: string = '';
  profileImg: any;
  currentEmail: any;




  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private authService: AuthService) { }
  ngOnInit(): void {
    this.currentEmail = localStorage.getItem('email');
    this.authService.getUserDetails(this.currentEmail).subscribe(
      response => {
        this.userDetails = response;
        this.name = this.userDetails[0].firstname;
        this.profileImg = this.userDetails[0].image;
      },
    );
  }






  toggleComponent(component: string): void {
    this.showAllAvailableCourses = false;
    this.showStudentCourses = false;
    this.showAssignments = false;
    this.showProfile = false;
    if (component === 'Assignments') {
      this.showAllAvailableCourses = false;
      this.showStudentCourses = false;
      this.showProfile = false;
      this.showAssignments = true;
      this.pagename = 'Assignments';
      this.activeLink = 'Assignments';
    }
    else if (component === 'My Courses') {
      this.showAllAvailableCourses = false;
      this.showStudentCourses = true;
      this.showAssignments = false;
      this.showProfile = false;
      this.pagename = 'My Courses';
      this.activeLink = 'My Courses';
    }
    else if (component === 'Available Courses') {
      this.showAllAvailableCourses = true;
      this.showStudentCourses = false;
      this.showAssignments = false;
      this.showProfile = false;
      this.pagename = 'Available Courses';
      this.activeLink = 'Available Courses';
    } else if (component === 'Profile') {
      this.showAllAvailableCourses = false;
      this.showStudentCourses = false;
      this.showAssignments = false;
      this.showProfile = true;
      this.pagename = 'Profile';
      this.activeLink = 'Profile';
    }
  }


  logOut() {
    localStorage.clear();
    this.router.navigate(['/login']);

  }
}
