import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/AuthService';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { Toast } from 'bootstrap';
import { Assignment, Course, Submission, ForgotPasswordResponse, CourseMaterial, LoginRequest, User } from 'src/app/models/allModels';


@Component({
  selector: 'app-studentassignment',
  templateUrl: './studentassignment.component.html',
  styleUrls: ['./studentassignment.component.css']
})
export class StudentassignmentComponent implements OnInit {
  public file: any = {}
  currentID: any;
  currentemail: any;
  assignments: Assignment[] = [];
  mySubmissions: Submission[] = [];

  errorMessage: any;
  successMessage: any;
  id: string | undefined;
  name: string | undefined;
  userDetails: User[] = [];
  teacherCourses: Course[] = [];

  submission: Submission = {
    submission_description: '',
    submission_assignment_id: 'test',
    submission_student_id: '',
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
    ////////////////////////////////////////////////////////////////////////
    this.currentemail = email;
    this.authService.studentAssignments(this.currentemail).subscribe(assignments => {
      this.assignments = assignments;
    });
    ////////////////////////////////////////////////////////////////////////////////////
    if (email) {
      this.authService.getID(email).subscribe(
        response => {
          this.id = response.id;
          localStorage.setItem('id', this.id);
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
    this.getMySubmissions();
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
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              },
              (error) => {


              }
            );
        });
      })
    ).subscribe();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////
  onSubmit(assignment_id: any): void {
    if (this.deadLineCheck(assignment_id)) {
      const userId = this.submission.submission_id;
      const storageRef = this.storage.ref(`submission/${userId}`).child(this.file.name);
      const uploadTask = storageRef.put(this.file);
      const id = localStorage.getItem('id');
      this.currentID = id;
      this.submission.submission_student_id = this.currentID;
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadURL) => {
            const encodedDownloadURL = (downloadURL);
            this.submission.answerURL = encodedDownloadURL;
            this.authService.addSubmission(this.submission).subscribe(
              () => {
                this.successMessage = 'submission added successfully';
                this.errorMessage = '';
                alert('successfully submitted ');
                setTimeout(() => {
                  window.location.reload();
                }, 2000)
              },
              (error) => {
                if (
                  error.error &&
                  error.error.message &&
                  error.error.message === 'submission already exists'
                ) {
                  alert('error ');
                  this.successMessage = '';
                  this.errorMessage = 'submission with this name already exists';
                } else {
                  alert('error ');
                  this.successMessage = '';
                  this.errorMessage = 'An error occurred during submission creation. Please try again later.';
                }
              }
            );
          });
        })
      ).subscribe();
    }
    else {
      this.successMessage = '';
      this.errorMessage = 'Deadline has passed';
    }
  }
  deadLineCheck(submission_assignment_id: any) {
    for (let assignment of this.assignments) {
      if (assignment.assignment_id === submission_assignment_id) {
        const deadlineDate = new Date(
          parseInt(assignment.deadline.split('-')[0]), // year
          parseInt(assignment.deadline.split('-')[1]) - 1, // month (zero-indexed)
          parseInt(assignment.deadline.split('-')[2]) // day
        );
        const currentDate = new Date();
        if (currentDate > deadlineDate) {
          return false;
        } else {
          return true;
        }
      }
    }
    return false;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////

  getMySubmissions() {
    const id = localStorage.getItem('id');
    this.currentID = id;
    this.authService.studentMySubmissions(this.currentID).subscribe(mySubmissions => {
      this.mySubmissions = mySubmissions;
    });
  }

  deleteSubmission() {
    const id = localStorage.getItem('id');
    this.currentID = id;
    this.authService.studentDeleteSubmission(this.currentID).subscribe(
      () => {
        this.successMessage = 'Submission deleted successfully';
        window.location.reload();
      },
      (error) => {
        this.errorMessage = 'An error occurred while deleting the submission. Please try again later.';
      }
    );
  }




  openWebPage(link: string): void {
    window.open(link, '_blank');
  }

}




