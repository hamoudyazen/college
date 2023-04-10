import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/AuthService';
import { Input } from '@angular/core';
import { User } from 'src/app/user';
@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  userDetails: User[] = [];

  navbarCollapsed = true; // Add this line
  name: string | undefined;
  pagename: string = '';
  isSmallScreen!: boolean;
  //shows
  showAssignments: boolean = false;
  showStudentCourses: boolean = false;
  showAllAvailableCourses: boolean = false;

  activeLink: string = '';
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
    this.showAllAvailableCourses = false;
    this.showStudentCourses = false;
    this.showAssignments = false;

    if (component === 'Assignments') {
      this.showAllAvailableCourses = false;
      this.showStudentCourses = false;
      this.showAssignments = true;
      this.pagename = 'Assignments';
      this.activeLink = 'Assignments'; // set active link to courses
    }
    else if (component === 'My Courses') {
      this.showAllAvailableCourses = false;
      this.showStudentCourses = true;
      this.showAssignments = false;
      this.pagename = 'My Courses';
      this.activeLink = 'My Courses'; // set active link to courses
    }
    else if (component === 'Available Courses') {
      this.showAllAvailableCourses = true;
      this.showStudentCourses = false;
      this.showAssignments = false;
      this.pagename = 'Available Courses';
      this.activeLink = 'Available Courses'; // set active link to courses
    }



  }

  /////////////////////////////////////////////////////////////////////////////////////////////////// Logout ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  logOut() {
    this.authService.logout();
  }

}
