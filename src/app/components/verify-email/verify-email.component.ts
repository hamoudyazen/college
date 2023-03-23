import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/AuthService';
import { ForgotPasswordResponse } from 'src/app/ForgotPasswordResponse';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  errorMessage: string | undefined;
  email : string = '';
  verificationLink: string | undefined;

  constructor( private formBuilder: FormBuilder,  private authService: AuthService) {}

  ngOnInit() {}
  verifyEmail() {
    this.authService.verifyEmail(this.email).subscribe(
      (response: ForgotPasswordResponse) => {
        console.log('Email verify link was sent successfully.', 'email', this.email);
        this.verificationLink = response.verificationLink;
      },
      error => console.log('Error sending verification link to email:', error)
    );
  }




}
