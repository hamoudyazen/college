import { Component, Renderer2, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { AuthService } from './services/AuthService';

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

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private renderer: Renderer2,
    private AuthService: AuthService
  ) { }

  ngOnInit(): void {
    const script = this.renderer.createElement('script');
    script.src = '/assets/js/login.js';
    script.type = 'text/javascript';
    script.onload = () => {
      const ipAddress = (window as any).getIP();
      console.log(ipAddress); // handle the returned IP address here
      localStorage.setItem('ipAddress', ipAddress);
    };
    this.renderer.appendChild(document.head, script);

  }

}
