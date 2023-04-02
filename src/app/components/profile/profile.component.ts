import { Component, OnInit } from '@angular/core';
import { Toast } from 'bootstrap';
import { AuthService } from 'src/app/AuthService';
import { Course } from 'src/app/Course';
import { User } from 'src/app/user';
import { Router } from '@angular/router';
import { ForgotPasswordResponse } from 'src/app/ForgotPasswordResponse';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  id: string | undefined;
  errorMessage: string | undefined;
  successMessage: string | undefined;
  name: string | undefined;
  userDetails: User[] = [];

  constructor(private authService: AuthService, private router: Router) { }
  showLiveToast() {
    const liveToastEl = document.getElementById('liveToast');
    if (liveToastEl) {
      const liveToast = new Toast(liveToastEl);
      liveToast.show();
    }
  }
  ngOnInit(): void {

    //to call the getName function
    const email = localStorage.getItem('email');
    console.log('email', email);
    if (email) {
      this.authService.getID(email).subscribe(
        response => {
          this.id = response.id;
          this.authService.getUserDetails(this.id).subscribe(
            response => {
              this.userDetails = response;
              console.log('details', this.userDetails);
              this.name = this.userDetails[0].firstname;
            },
            error => this.errorMessage = 'Failed to get teacher details'
          );
        },
        error => console.log('Failed to get teacher id:', error)
      );
    }


  }

  updateProfileEmail(formData: any, originalEmail: any, userId: any) {
    const newEmail = formData.email;
    this.authService.updateProfileEmail(newEmail, originalEmail, userId)
      .subscribe(
        (response) => {
          console.log(response);
          localStorage.removeItem('email');
          this.authService.verifyEmail(newEmail).subscribe(
            (response: ForgotPasswordResponse) => { },
            (error) => console.log('Error sending verification link to email:', error)
          );

          this.router.navigateByUrl('/login');
        },
        (error) => console.log(error)
      );
  }

  updateProfileFirstname(originalName: any, formData: any, userId: any) {
    const newEmail = formData.email;
    this.authService.updateProfileFirstName(originalName, newEmail, userId)
      .subscribe(
        (response) => {
          console.log(response);
          this.router.navigateByUrl('/login');
        },
        (error) => console.log(error)
      );
  }


}
