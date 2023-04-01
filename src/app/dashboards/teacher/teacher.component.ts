import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/AuthService';

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
  activeLink: string = 'courses';
  ///////////
  toggleComponent(component: string): void {
    this.showRegisterCourse = false;
    this.showTeacherCourse = false;

    if (component === 'AddCourse') {
      this.showRegisterCourse = true;
      this.showTeacherCourse = false;
      this.pagename = 'AddCourse';
      this.activeLink = 'AddCourse'; // set active link to courses
    }

    else if (component === 'TeacherCourse') {
      this.showTeacherCourse = true;
      this.showRegisterCourse = false;
      this.pagename = 'TeacherCourse';
      this.activeLink = 'TeacherCourse'; // set active link to courses
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
          this.name = response.name;
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
