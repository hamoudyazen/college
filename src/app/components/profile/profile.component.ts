import { Component, OnInit } from '@angular/core';
import { Toast } from 'bootstrap';
import { AuthService } from 'src/app/AuthService';
import { Course } from 'src/app/Course';
import { User } from 'src/app/user';
import { Router } from '@angular/router';
import { ForgotPasswordResponse } from 'src/app/ForgotPasswordResponse';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage'
import { storage } from 'firebase-admin';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  public file: any = {}
  id: string | undefined;
  errorMessage: string | undefined;
  successMessage: string | undefined;
  name: string | undefined;
  userDetails: User[] = [];
  lastname: string | undefined;
  firstname: string | undefined;

  constructor(private authService: AuthService, private router: Router, private storage: AngularFireStorage) { }
  showLiveToast() {
    const liveToastEl = document.getElementById('liveToast');
    if (liveToastEl) {
      const liveToast = new Toast(liveToastEl);
      liveToast.show();
    }
  }

  ngOnInit(): void {
    /////////////////////////////////////////////////////////////////////////////////////////////////////////GET USER'S NAME////////////////////////////////////////////////////////////////////////////////////
    const email = localStorage.getItem('email');
    if (email) {
      this.authService.getID(email).subscribe(
        response => {
          this.id = response.id;
          this.authService.getUserDetails(this.id).subscribe(
            response => {
              this.userDetails = response;
              this.name = this.userDetails[0].firstname;
            },
            error => this.errorMessage = 'Failed to get teacher details'
          );
        },
        error => console.log(''));
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////UPDATE EMAIL ////////////////////////////////////////////////////////////////////////////////////
  updateProfileEmail(formData: any, originalEmail: any, userId: any) {
    const newEmail = formData.email;
    this.authService.updateProfileEmail(newEmail, originalEmail, userId).subscribe(
      (response) => {
        localStorage.removeItem('email');
        this.authService.verifyEmail(newEmail).subscribe(
        );
        this.successMessage = 'Email updated successfully';
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 2000);
      },
      (error) => {
        this.errorMessage = "Email didn't update"
      }
    );
  }

  isValidEmail(value: any) {
    const newName = value.email?.trim();
    const oldName = value.originalEmail?.trim();
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return newName && emailPattern.test(newName) && newName !== oldName;
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////UPDATE FIRST NAME////////////////////////////////////////////////////////////////////////////////////
  updateProfileFirstname(formData: any, originalEmail: any, userId: any) {
    const newEmail = formData.email;
    this.authService.updateProfileFirstname(newEmail, originalEmail, userId).subscribe(
      (response) => {
        this.successMessage = 'Last name updated successfully';
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      (error) => {
        this.errorMessage = error.error.message;
      }
    );
  }

  isValidFirstname(old: any, value: any) {
    const pattern = /^[a-zA-Z]+$/;
    const newName = value.email?.trim();
    const oldName = value.originalEmail?.trim();
    return newName && newName.length >= 3 && pattern.test(newName) && newName !== old;
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////UPDATE LAST NAME////////////////////////////////////////////////////////////////////////////////////
  updateProfileLastname(formData: any, originalEmail: any, userId: any) {
    const newEmail = formData.email;
    this.authService.updateProfileLastname(newEmail, originalEmail, userId).subscribe(
      (response) => {
        this.successMessage = 'Last name updated successfully';
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }

  isValidLastname(old: any, value: any) {
    const pattern = /^[a-zA-Z]+$/;
    const newName = value.email?.trim();
    const oldName = value.originalEmail?.trim();
    return newName && newName.length >= 3 && pattern.test(newName) && newName !== old;
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////UPDATE PASSWORD  ////////////////////////////////////////////////////////////////////////////////////
  updateProfilePassword(formData: any, originalPassword: any, userId: any) {
    const newPassword = formData.password;
    this.authService.updateProfilePassword(newPassword, originalPassword, userId).subscribe(
      (response) => {
        this.successMessage = 'Password updated successfully';
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      (error) => {
        this.errorMessage = error;
      },
    );
  }

  isValidPassword(value: any) {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const newPassword = value.password?.trim();
    const oldPassword = value.originalPassword?.trim();
    return newPassword && newPassword.length >= 8 && pattern.test(newPassword) && newPassword !== oldPassword;
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////UPDATE PHOTO ////////////////////////////////////////////////////////////////////////////////////
  choseFile(event: any) {
    this.file = event.target.files[0];
  }

  addData() {
    const userId = this.id;
    const storageRef = this.storage.ref(`profile/${userId}`).child(this.file.name);
    const uploadTask = storageRef.put(this.file);
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          const encodedDownloadURL = encodeURIComponent(downloadURL);
          this.authService.updateProfilePicture(encodedDownloadURL, userId).subscribe(
            (response) => {
              this.successMessage = 'Profile picture updated successfully';
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            },
            (error) => {
              this.errorMessage = error.error.message;
            }
          );
        });
      })
    ).subscribe();
  }

}
