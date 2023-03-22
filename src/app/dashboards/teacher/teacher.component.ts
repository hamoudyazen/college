import { Component, OnInit, Renderer2, ElementRef, QueryList, ViewChildren } from '@angular/core';
import {  ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent  {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isSmallScreen!: boolean;
  name: any;

  constructor(private breakpointObserver: BreakpointObserver , private router : Router) {
    this.name = localStorage.getItem('name');
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .subscribe((state) => {
        this.isSmallScreen = state.matches;
      });
      if(localStorage.getItem('token')) {
        this.name = localStorage.getItem('name');
      }


  }

  logoutUser() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
