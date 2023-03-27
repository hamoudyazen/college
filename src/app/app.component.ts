import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  yazen: any;
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  showDropdown = false;

  showRegisterCourse: boolean = false;
  toggleShowAllAddCourse(): void {
    this.showRegisterCourse = !this.showRegisterCourse;
  }




  toggleComponent(component: string): void {
    this.showRegisterCourse = false;

    if (component === 'AddCourse') {
      this.showRegisterCourse = true;
    }
  }
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    this.yazen = 'yazen'
  }
}
