import { Component } from '@angular/core';
import { AuthService } from 'src/app/AuthService';
import { User } from 'src/app/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  errorMessage: string | undefined;
  user: User = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: '',
    major: ''
  };

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.authService.register(this.user).subscribe(
      () => {
        console.log('registration completed successfully');
        this.router.navigateByUrl('/login');
      },
      (error) => {
        if (error.error && error.error.message && error.error.message === 'User Already Exist') {
          this.errorMessage = 'User with this email already exist';
        }
        else if (error.error && error.error.message && error.error.message === 'Password Short') {
          this.errorMessage = 'Password Short';
        }
        else {
          this.errorMessage = 'An error occurred during registration , Please try again later..';
        }
      }
    );
  }
}
