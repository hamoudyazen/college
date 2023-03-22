import { Component } from '@angular/core';
import { AuthService } from 'src/app/AuthService';
import { Router } from '@angular/router';
import { User } from 'src/app/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  users: User[] | undefined;
  email: string | undefined;
  password: string | undefined;
  name: string | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getAllUsers().subscribe(
      response => {
        console.log('Got all users:', response);
        this.users = response;
      },
      error => console.log('Failed to get users:', error)
    );
  }

  login() {
    const loginRequest = {
      email: this.email,
      password: this.password
    };

    this.authService.loginn(loginRequest).subscribe(
      response => {
        console.log('Login successful', response);
        this.router.navigate(['/teacher']);
        this.name = this.getNameFromEmail();
        this.name = this.getNameFromEmail();
        console.log('Name:', this.name);
        localStorage.setItem('name', this.name || '');
      },
      error => console.log('Login failed', error, this.email, this.password)
    );
  }

  getNameFromEmail(): string | undefined {
    if (this.email && this.users) {
      const user = this.users.find(u => u.email === this.email);
      if (user) {
        return user.name;
      }
    }
    return undefined;
  }
}
