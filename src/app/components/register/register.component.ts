import { Component } from '@angular/core';
import { AuthService } from 'src/app/AuthService';
import { User } from 'src/app/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: User = {
    name: '',
    email: '',
    password: '',
    role: ''
  };

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.authService.register(this.user).subscribe(
      () => {
        alert('Registration successful!');
      },
      (error) => {
        alert(`Registration failed: ${error.error.message}`);
      }
    );
  }
}
