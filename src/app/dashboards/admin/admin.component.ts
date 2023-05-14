import { Component, OnInit, Renderer2 } from '@angular/core';
import { Assignment, Course, Submission, ForgotPasswordResponse, CourseMaterial, LoginRequest, User } from 'src/app/models/allModels';
import { ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    const script = this.renderer.createElement('script');
    script.src = '/assets/js/sidebar.js';
    script.type = 'text/javascript';
    script.onload = () => {
      const ipAddress = (window as any).getIP();
      console.log(ipAddress); // handle the returned IP address here
      localStorage.setItem('ipAddress', ipAddress);
    };
    this.renderer.appendChild(document.head, script);


  }

}
