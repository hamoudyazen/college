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
  name: string | undefined;
  //used for css
  pagename: string = '';
  isSmallScreen!: boolean;
  showRegisterCourse: boolean = true;
  activeLink: string = 'courses'; // added property to keep track of active link
  toggleShowAllAddCourse(): void {
    this.showRegisterCourse = !this.showRegisterCourse;
  }
  toggleComponent(component: string): void {
    this.showRegisterCourse = false;

    if (component === 'AddCourse') {
      this.showRegisterCourse = true;
      this.pagename = 'AddCourse';
      this.activeLink = 'AddCourse'; // set active link to courses
    }
  }


  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    //to call the getName function
    const email = localStorage.getItem('email');
    console.log('email', email);
    if (email) {
      this.authService.getName(email).subscribe(
        response => this.name = response.name,
        error => console.log('Failed to get user name:', error)
      );
    }
    console.log('name', name);
  }


  //to log user out (not complete needs fixing)
  logoutUser() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
