import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService';
import { Input } from '@angular/core';
import { Assignment, Course, Submission, ForgotPasswordResponse, CourseMaterial, LoginRequest, User } from 'src/app/models/allModels';
import { SharedService } from 'src/app/services/SharedService';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {

  pagename: string = '';
  showRegisterCourse: boolean = false;
  showTeacherCourse: boolean = true;
  showAssignment: boolean = false;
  showSchedule: boolean = false;
  showProfile: boolean = false;
  activeLink: string = 'courses';

  //shared
  teacherCourses: Course[] = [];
  userDetails: User[] = [];
  currentEmail: any;
  id: any;
  firstname: any;
  lastname: any;
  email: any;
  password: any;
  role: any;
  name: any;
  profileImg: any;
  major: any;
  semester: any;
  //end of shared

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private authService: AuthService, private sharedService: SharedService) { }
  async ngOnInit(): Promise<void> {
    try {
      this.userDetails = await this.sharedService.getUserDetails(); // Assign the resolved value to teacherCourses
      this.teacherCourses = await this.sharedService.getTeacherCourses();
      this.userDetails = this.sharedService.userDetails;
      this.email = this.sharedService.email;
      this.id = this.sharedService.id;
      this.firstname = this.sharedService.firstname;
      this.lastname = this.sharedService.lastname;
      this.password = this.sharedService.password;
      this.role = this.sharedService.role;
      this.name = this.sharedService.name;
      this.profileImg = this.sharedService.profileImg;
      this.major = this.sharedService.major;
      this.semester = this.sharedService.semester;
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }











  toggleComponent(component: string): void {
    this.showRegisterCourse = false;
    this.showTeacherCourse = false;
    this.showProfile = false;
    this.showAssignment = false;
    this.showSchedule = false;
    this.activeLink = component;

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
