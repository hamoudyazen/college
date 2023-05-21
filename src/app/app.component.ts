import { Component, Renderer2, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Injectable, HostListener } from '@angular/core';
import { AuthService } from './services/AuthService';
import { SharedService } from './services/SharedService';
import { User } from './models/allModels';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  yazen: any;
  userDetails: User[] = [];
  majorId: any;
  title(title: any) {
    throw new Error('Method not implemented.');
  }

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private renderer: Renderer2,
    private AuthService: AuthService,
    private SharedService: SharedService
  ) { }
  ngOnInit(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        this.userDetails = await this.SharedService.getUserDetails();
        this.userDetails = this.SharedService.userDetails;

        this.AuthService.getMajorDetails(this.userDetails[0].major).subscribe(response => {
          this.majorId = response[0].id;
          resolve();
        });
      } catch (error) {
        console.error('Error retrieving data:', error);
        reject(error);
      }
    });
  }

}
/*  ngOnInit(): void {
    const script = this.renderer.createElement('script');
    script.src = '/assets/js/login.js';
    script.type = 'text/javascript';
    script.onload = () => {
      const ipAddress = (window as any).getIP();
      console.log(ipAddress); // handle the returned IP address here
      localStorage.setItem('ipAddress', ipAddress);
    };
    this.renderer.appendChild(document.head, script);

  } */