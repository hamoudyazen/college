import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/AuthService';
import { Course } from 'src/app/Course';
import { Assignment } from 'src/app/Assignment';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { Toast } from 'bootstrap';
import { User } from 'src/app/user';
import { Submission } from 'src/app/submission';

@Component({
  selector: 'app-studentassignment',
  templateUrl: './studentassignment.component.html',
  styleUrls: ['./studentassignment.component.css']
})
export class StudentassignmentComponent implements OnInit {
  public file: any = {}

  currentemail: any;
  assignments: Assignment[] = [];
  errorMessage: any;
  successMessage: any;
  id: string | undefined;
  name: string | undefined;
  userDetails: User[] = [];
  teacherCourses: Course[] = [];

  submission: Submission = {
    submission_description: '',
    submission_assignment_id: 'test',
    answerURL: '',
  };
  constructor(private authService: AuthService, private router: Router, private storage: AngularFireStorage) { }

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.authService.getID(email).subscribe(
        (response) => {
          this.id = response.id;
          this.authService.getUserDetails(this.id).subscribe(
            (response) => {
              this.userDetails = response;
              this.name = this.userDetails[0].firstname;
            },
            (error) => (this.errorMessage = 'Failed to get teacher details')
          );
        },
        (error) => console.log('')
      );
    }

    if (email) {
      this.authService.getID(email).subscribe((response) => {
        this.id = response.id;

        this.authService.getTeacherCourses(this.id).subscribe(
          (courses) => {
            this.successMessage = response;
            this.teacherCourses = courses;
          },
          (error) => {
            this.errorMessage = error.message;
          }
        );
      });
    }

    this.currentemail = email;
    this.authService.studentAssignments(this.currentemail).subscribe(assignments => {
      this.assignments = assignments;
    });

    //
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

  showLiveToast() {
    const liveToastEl = document.getElementById('liveToast');
    if (liveToastEl) {
      const liveToast = new Toast(liveToastEl);
      liveToast.show();
    }
  }

  choseFile(event: any) {
    this.file = event.target.files[0];
  }

  addData() {
    const userId = this.submission.submission_id;
    const storageRef = this.storage.ref(`submission/${userId}`).child(this.file.name);
    const uploadTask = storageRef.put(this.file);
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe((downloadURL) => {
          const encodedDownloadURL = encodeURIComponent(downloadURL);
          this.authService
            .updateSubmissionLink(encodedDownloadURL, userId)
            .subscribe(
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


  onSubmit(): void {
    const userId = this.submission.submission_id;
    const storageRef = this.storage.ref(`submission/${userId}`).child(this.file.name);
    const uploadTask = storageRef.put(this.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe((downloadURL) => {
          const encodedDownloadURL = (downloadURL);
          this.submission.answerURL = encodedDownloadURL;
          this.authService.addSubmission(this.submission).subscribe(
            () => {
              this.successMessage = 'submission added successfully';
            },
            (error) => {
              if (
                error.error &&
                error.error.message &&
                error.error.message === 'submission already exists'
              ) {
                this.errorMessage = 'submission with this name already exists';
              } else {
                this.errorMessage = 'An error occurred during submission creation. Please try again later.';
              }
            }
          );
        });
      })
    ).subscribe();
  }

}



