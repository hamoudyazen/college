import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService';
import { Input } from '@angular/core';
import { Assignment, Course, Submission, ForgotPasswordResponse, CourseMaterial, LoginRequest, User } from 'src/app/models/allModels';


@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  userDetails: User[] = [];
  navbarCollapsed = true;
  currentEmail: any;
  name: any;
  profileImg: any;
  pagename: string = '';
  isSmallScreen!: boolean;
  showRegisterCourse: boolean = false;
  showTeacherCourse: boolean = false;
  showAssignment: boolean = false;
  showSchedule: boolean = true;
  showProfile: boolean = false;
  activeLink: string = 'courses';
  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private authService: AuthService) { }
  ngOnInit(): void {
    this.currentEmail = localStorage.getItem('email');
    this.authService.getUserDetails(this.currentEmail).subscribe(
      response => {
        this.userDetails = response;
        localStorage.setItem('userDetails', JSON.stringify(this.userDetails));
        this.name = this.userDetails[0].firstname;
        this.profileImg = this.userDetails[0].image;
      },
    );
  }









  toggleComponent(component: string): void {
    this.showRegisterCourse = false;
    this.showTeacherCourse = false;
    this.showProfile = false;
    this.showAssignment = false;
    this.showSchedule = false;

    if (component === 'Add Course') {
      this.showRegisterCourse = true;
      this.showTeacherCourse = false;
      this.showProfile = false;
      this.showAssignment = false;
      this.showSchedule = false;
      this.pagename = 'Add Course';
      this.activeLink = 'Add Course';
    }

    else if (component === 'My Courses') {
      this.showTeacherCourse = true;
      this.showRegisterCourse = false;
      this.showProfile = false;
      this.showAssignment = false;
      this.showSchedule = false;
      this.pagename = 'My Courses';
      this.activeLink = 'My Courses';
    }
    else if (component === 'Profile') {
      this.showTeacherCourse = false;
      this.showRegisterCourse = false;
      this.showAssignment = false;
      this.showSchedule = false;
      this.showProfile = true;
      this.pagename = 'Profile';
      this.activeLink = 'Profile';
    }
    else if (component === 'Assignment') {
      this.showTeacherCourse = false;
      this.showRegisterCourse = false;
      this.showAssignment = true;
      this.showProfile = false;
      this.showSchedule = false;
      this.pagename = 'Add Assignment';
      this.activeLink = 'Add Assignment';
    }

    else if (component === 'Schedule') {
      this.showTeacherCourse = false;
      this.showRegisterCourse = false;
      this.showAssignment = false;
      this.showProfile = false;
      this.showSchedule = true;
      this.pagename = 'Schedule';
      this.activeLink = 'Schedule'; // set active link to courses
    }
  }


  logOut() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
