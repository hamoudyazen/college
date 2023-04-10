import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/AuthService';
import { Input } from '@angular/core';
import { User } from 'src/app/user';
@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {
  userDetails: User[] = [];

  @ViewChild('sidenav') sidenav!: MatSidenav;
  navbarCollapsed = true; // Add this line
  name: string | undefined;
  pagename: string = '';
  isSmallScreen!: boolean;
  //shows
  showRegisterCourse: boolean = false;
  showTeacherCourse: boolean = false;
  showAssignment: boolean = false;
  showProfile: boolean = false;
  activeLink: string = 'courses';
  /////////////////
  id!: string;
  errorMessage!: string;

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    //to call the getName function
    const email = localStorage.getItem('email');
    if (email) {
      this.authService.getName(email).subscribe(
        response => {
          this.name = response.firstname;
        },
        error => console.log('Failed to get user name:', error)
      );
    }
    //to call the getID function
    if (email) {
      this.authService.getID(email).subscribe(
        response => {
          this.id = response.id;
          this.authService.getUserDetails(this.id).subscribe(
            response => {
              this.userDetails = response;
              this.name = this.userDetails[0].firstname;
            },
            error => this.errorMessage = 'Failed to get teacher details'
          );
        },
        error => console.log('Failed to get teacher id:', error)
      );
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////// Display Components ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  toggleComponent(component: string): void {
    this.showRegisterCourse = false;
    this.showTeacherCourse = false;
    this.showProfile = false;
    this.showAssignment = false;

    if (component === 'Add Course') {
      this.showRegisterCourse = true;
      this.showTeacherCourse = false;
      this.showProfile = false;
      this.showAssignment = false;
      this.pagename = 'Add Course';
      this.activeLink = 'Add Course'; // set active link to courses
    }

    else if (component === 'My Courses') {
      this.showTeacherCourse = true;
      this.showRegisterCourse = false;
      this.showProfile = false;
      this.showAssignment = false;
      this.pagename = 'My Courses';
      this.activeLink = 'My Courses'; // set active link to courses
    }
    else if (component === 'Profile') {
      this.showTeacherCourse = false;
      this.showRegisterCourse = false;
      this.showAssignment = false;
      this.showProfile = true;
      this.pagename = 'Profile';
      this.activeLink = 'Profile'; // set active link to courses
    }
    else if (component === 'Assignment') {
      this.showTeacherCourse = false;
      this.showRegisterCourse = false;
      this.showAssignment = true;
      this.showProfile = false;
      this.pagename = 'Add Assignment';
      this.activeLink = 'Add Assignment'; // set active link to courses
    }

  }

  /////////////////////////////////////////////////////////////////////////////////////////////////// Logout ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  logOut() {
    this.authService.logout();
  }

}
