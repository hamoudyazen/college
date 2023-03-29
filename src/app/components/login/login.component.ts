import { Component } from '@angular/core';
import { AuthService } from 'src/app/AuthService';
import { Router } from '@angular/router';
import { User } from 'src/app/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  errorMessage: string | undefined;
  email: string | undefined;
  password: string | undefined;
  name: string | undefined;
  counter: number = 5;
  isRedirecting: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void { }

  login() {
    const loginRequest = {
      email: this.email,
      password: this.password,
    };

    this.authService.loginn(loginRequest).subscribe(
      (response) => {
        console.log('Login successful');
        localStorage.setItem('email', this.email || '');
        this.router.navigate(['/teacher']);
        // localStorage.setItem('name', this.name || '');
      },
      (error) => {
        if (error.error && error.error.message && error.error.message === 'Email is not verified') {
          this.errorMessage = 'Email is not verified';
          this.isRedirecting = true;
          // Redirect to verify email page after 5 seconds
          const intervalId = setInterval(() => {
            this.counter--;
            if (this.counter === 0) {
              clearInterval(intervalId);
              this.router.navigate(['/verify-email']);
            }
          }, 1000);
          // Reset the countdown
          this.counter = 5;
        }
        else if (error.error && error.error.message && error.error.message === 'Wrong Password') {
          this.errorMessage = 'Wrong Password';
        }
        else if (error.error && error.error.message && error.error.message === 'User Not Registered') {
          this.errorMessage = 'User Not Registered';
        }
        else {
          this.errorMessage =
            'An error occurred during Login , Please try again later..';
        }
      }
    );
  }
}
