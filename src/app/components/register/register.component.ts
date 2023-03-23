import { Component } from '@angular/core';
import { AuthService } from 'src/app/AuthService';
import { User } from 'src/app/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  errorMessage: string | undefined;
  user: User = {
    name: '',
    email: '',
    password: '',
    role: ''
  };

  constructor(private authService: AuthService , private router : Router) {}

  onSubmit(): void {
    this.authService.register(this.user).subscribe(
      () => {
        console.log('registration completed successfully')
        this.router.navigateByUrl('/login');
            },
      (error) => {
        this.errorMessage = 'An error occurred during registration , Please try again later..';
        console.log('registration failed ')

      }
    );
  }
}
