import { Component } from '@angular/core';
import { AuthService } from 'src/app/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string | undefined;
  password: string | undefined;
  constructor(private authService: AuthService, private router: Router) {}

  login() {
    const loginRequest = {
      email: this.email,
      password: this.password
    };

    this.authService.loginn(loginRequest).subscribe(
      response => {
        console.log('Login successful', response);
        this.router.navigate(['/teacher']);
      },
      error => console.log('Login failed', error , this.email , this.password)
    );
  }
}
