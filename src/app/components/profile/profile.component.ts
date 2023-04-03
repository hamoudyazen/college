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
  lastname: string | undefined;
  firstname: string | undefined;

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
    this.authService.updateProfileEmail(newEmail, originalEmail, userId).subscribe(
      (response) => {
        console.log(response);
        localStorage.removeItem('email');
        this.authService.verifyEmail(newEmail).subscribe(
        );
        this.router.navigateByUrl('/login');
      },
    );
  }
  isValidEmail(value: any) {
    const newName = value.email?.trim();
    const oldName = value.originalEmail?.trim();
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return newName && emailPattern.test(newName) && newName !== oldName;
  }


  updateProfileFirstname(formData: any, originalEmail: any, userId: any) {
    const newEmail = formData.email;
    this.authService.updateProfileFirstname(newEmail, originalEmail, userId).subscribe(
      (response) => {
        console.log(response);
      },
    );
  }
  //LAST NAME
  updateProfileLastname(formData: any, originalEmail: any, userId: any) {
    const newEmail = formData.email;
    this.authService.updateProfileLastname(newEmail, originalEmail, userId).subscribe(
      (response) => {
        console.log(response);
      },
    );
  }

  isValidLastname(value: any) {
    const pattern = /^[a-zA-Z]+$/;
    const newName = value.email?.trim();
    const oldName = value.originalEmail?.trim();
    return newName && newName.length >= 6 && pattern.test(newName) && newName !== oldName;
  }


  //PASSWORD
  updateProfilePassword(formData: any, originalPassword: any, userId: any) {
    const newPassword = formData.password;
    this.authService.updateProfilePassword(newPassword, originalPassword, userId).subscribe(
      (response) => {
        console.log(response);
      },
    );
  }

  isValidPassword(value: any) {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const newPassword = value.password?.trim();
    const oldPassword = value.originalPassword?.trim();
    return newPassword && newPassword.length >= 8 && pattern.test(newPassword) && newPassword !== oldPassword;
  }







}
