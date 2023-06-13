import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/AuthService';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { Toast } from 'bootstrap';
import { Assignment, Course, Submission, ForgotPasswordResponse, CourseMaterial, User } from 'src/app/models/allModels';
import { SharedService } from 'src/app/services/SharedService';

@Component({
  selector: 'app-studentassignment',
  templateUrl: './studentassignment.component.html',
  styleUrls: ['./studentassignment.component.css']
})
export class StudentassignmentComponent implements OnInit {
  public file: any = {}
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
  constructor(private authService: AuthService, private router: Router, private storage: AngularFireStorage, private SharedService: SharedService) { }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      this.userDetails = await this.SharedService.getUserDetails();
      this.getMySubmissions();
      this.authService.studentAssignments(this.userDetails[0].email).subscribe(assignments => {
        this.assignments = assignments;
      });

    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }

  //for chosing a file to upload to db
  choseFile(event: any) {
    this.file = event.target.files[0];
  }

  //called to add a new item to firebase storage.
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
                alert('error , check console , addData()');
                console.log(error);
              }
            );
        });
      })
    ).subscribe();
  }

  //add a new submission to db.
  onSubmit(assignment_id: any): void {
    if (this.deadLineCheck(assignment_id)) {
      const userId = this.submission.submission_id;
      const storageRef = this.storage.ref(`submission/${userId}`).child(this.file.name);
      const uploadTask = storageRef.put(this.file);

      this.submission.submission_student_id = this.userDetails[0].id!;
      uploadTask.snapshotChanges()
        .pipe(
          finalize(() => {
            storageRef.getDownloadURL().subscribe((downloadURL) => {
              const encodedDownloadURL = downloadURL;
              this.submission.answerURL = encodedDownloadURL;
              this.authService.addSubmission(this.submission).subscribe();
            });
          })
        )
        .subscribe();
    } else {
      alert('Deadline has passed');
    }
  }

  //check if the submission date has passed
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

  //get user's submissions
  getMySubmissions() {
    this.authService.studentMySubmissions(this.userDetails[0].id).subscribe(mySubmissions => {
      this.mySubmissions = mySubmissions;
    });
  }

  //delete a submission 
  deleteSubmission() {
    this.authService.studentDeleteSubmission(this.userDetails[0].id).subscribe(
      () => {
        window.location.reload();
      },
      (error) => {
        alert('Error occurred while deleting the submissio , check console');
        console.log(error);
      }
    );
  }

  openWebPage(link: string): void {
    window.open(link, '_blank');
  }

}

