import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/AuthService';
import { Input } from '@angular/core';
@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {

  @ViewChild('sidenav') sidenav!: MatSidenav;
  navbarCollapsed = true; // Add this line
  name: string | undefined;
  //used for css
  pagename: string = '';
  isSmallScreen!: boolean;
  showRegisterCourse: boolean = false;
  showTeacherCourse: boolean = false;
  showProfile: boolean = false;
  activeLink: string = 'courses';
  ///////////
  toggleComponent(component: string): void {
    this.showRegisterCourse = false;
    this.showTeacherCourse = false;
    this.showProfile = false;

    if (component === 'AddCourse') {
      this.showRegisterCourse = true;
      this.showTeacherCourse = false;
      this.showProfile = false;
      this.pagename = 'AddCourse';
      this.activeLink = 'AddCourse'; // set active link to courses
    }

    else if (component === 'TeacherCourse') {
      this.showTeacherCourse = true;
      this.showRegisterCourse = false;
      this.showProfile = false;
      this.pagename = 'My Courses';
      this.activeLink = 'TeacherCourse'; // set active link to courses
    }

    else if (component === 'Profile') {
      this.showTeacherCourse = false;
      this.showRegisterCourse = false;
      this.showProfile = true;
      this.pagename = 'Profile';
      this.activeLink = 'Profile'; // set active link to courses
    }

  }


  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    //to call the getName function
    const email = localStorage.getItem('email');
    console.log('email', email);
    if (email) {
      this.authService.getName(email).subscribe(
        response => {
          this.name = response.firstname;
          console.log('name', this.name);
        },
        error => console.log('Failed to get user name:', error)
      );
    }
  }



  //to log user out (not complete needs fixing)
  logoutUser() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
