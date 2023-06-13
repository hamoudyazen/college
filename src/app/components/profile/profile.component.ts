import { Component, OnInit } from '@angular/core';
import { Toast } from 'bootstrap';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage'
import { storage } from 'firebase-admin';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { Assignment, Course, Submission, ForgotPasswordResponse, CourseMaterial, User } from 'src/app/models/allModels';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  public file: any = {}
  userDetails: User[] = [];
  currentEmail: any;
  id: any;
  name: any;
  email: any;
  firstname: any;
  lastname: any;
  image: any;
  password: any;
  role: any;




  constructor(private authService: AuthService, private router: Router, private storage: AngularFireStorage) { }
  ngOnInit(): void {
    this.currentEmail = localStorage.getItem('email');
    this.authService.getUserDetails(this.currentEmail).subscribe(
      response => {
        this.userDetails = response;
        localStorage.setItem('userDetails', JSON.stringify(this.userDetails));
        this.name = this.userDetails[0].firstname;
        this.id = this.userDetails[0].id;
        this.email = this.userDetails[0].email;
        this.firstname = this.userDetails[0].firstname;
        this.lastname = this.userDetails[0].lastname;
        this.image = this.userDetails[0].image;
        this.password = this.userDetails[0].password;
        this.role = this.userDetails[0].role;
      },
    );
  }









  updateProfileEmail(formData: any, originalEmail: any, userId: any) {
    const newEmail = formData.email;
    this.authService.updateProfileEmail(newEmail, originalEmail, userId).subscribe(
      (response) => {
        localStorage.removeItem('email');
        this.authService.verifyEmail(newEmail).subscribe(
        );
        alert('Email updated successfully');
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 2000);
      },
      (error) => {
        alert('Email didnt update');
      }
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
        alert('Last name updated successfully');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      (error) => {
        alert('Last name didnt update')
      }
    );
  }
  isValidFirstname(old: any, value: any) {
    const pattern = /^[a-zA-Z]+$/;
    const newName = value.email?.trim();
    const oldName = value.originalEmail?.trim();
    return newName && newName.length >= 3 && pattern.test(newName) && newName !== old;
  }








  updateProfileLastname(formData: any, originalEmail: any, userId: any) {
    const newEmail = formData.email;
    this.authService.updateProfileLastname(newEmail, originalEmail, userId).subscribe(
      (response) => {
        alert('Last name updated successfully');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      (error) => {
        alert('Last name didnt update')
      }
    );
  }
  isValidLastname(old: any, value: any) {
    const pattern = /^[a-zA-Z]+$/;
    const newName = value.email?.trim();
    const oldName = value.originalEmail?.trim();
    return newName && newName.length >= 3 && pattern.test(newName) && newName !== old;
  }



  updateProfilePassword(formData: any, originalPassword: any, userId: any) {
    const newPassword = formData.password;
    this.authService.updateProfilePassword(newPassword, originalPassword, userId).subscribe(
      (response) => {
        alert('Password updated successfully');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      (error) => {
        alert('Password didnt update')
      },
    );
  }

  isValidPassword(value: any) {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const newPassword = value.password?.trim();
    const oldPassword = value.originalPassword?.trim();
    return newPassword && newPassword.length >= 8 && pattern.test(newPassword) && newPassword !== oldPassword;
  }









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
              alert('Profile picture updated successfully');
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            },
            (error) => {
              alert('Profile picture didnt update')
            }
          );
        });
      })
    ).subscribe();
  }

}
