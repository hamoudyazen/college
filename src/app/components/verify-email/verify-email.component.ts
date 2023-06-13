import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/AuthService';
import { Assignment, Course, Submission, ForgotPasswordResponse, CourseMaterial, User } from 'src/app/models/allModels';
import { Component, Renderer2, OnInit } from '@angular/core';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
})
export class VerifyEmailComponent implements OnInit {
  errorMessage: string | undefined;
  email: string = '';
  verificationLink: string | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    const script = this.renderer.createElement('script');
    script.src = '/assets/js.js';
    script.type = 'text/javascript';
    this.renderer.appendChild(document.head, script);
  }
  verifyEmail() {
    this.authService.verifyEmail(this.email).subscribe(
      (response: ForgotPasswordResponse) => {
        console.log(
          'Email verify link was sent successfully.',
          'email',
          this.email
        );
        this.verificationLink = response.verificationLink;
      },
      (error) => console.log('Error sending verification link to email:', error)
    );
  }
}
