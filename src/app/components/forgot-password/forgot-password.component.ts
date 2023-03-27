import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/AuthService';
import { ForgotPasswordResponse } from 'src/app/ForgotPasswordResponse';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  errorMessage: string | undefined;
  email: string = '';
  verificationLink: string | undefined;
  showVerificationLink: boolean = false; // add this variable

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {}
  resetPassword() {
    this.authService.resetPassword(this.email).subscribe(
      (response: ForgotPasswordResponse) => {
        console.log(
          'Password reset email sent successfully.',
          'email',
          this.email
        );
        this.verificationLink = response.verificationLink;
        this.showVerificationLink = true; // set the variable to true when the link is generated
      },
      (error) => console.log('Error sending password reset email:', error)
    );
  }
}
