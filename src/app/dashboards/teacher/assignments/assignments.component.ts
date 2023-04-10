import { Component, OnInit } from '@angular/core';
import { Toast } from 'bootstrap';
import { AuthService } from 'src/app/AuthService';
import { Course } from 'src/app/Course';
import { User } from 'src/app/user';
import { Router } from '@angular/router';
import { ForgotPasswordResponse } from 'src/app/ForgotPasswordResponse';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Assignment } from 'src/app/Assignment';
import { Submission } from 'src/app/submission';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {
  public file: any = {};
  errorMessage: any;
  successMessage: any;
  id: string | undefined;
  name: string | undefined;
  userDetails: User[] = [];
  teacherCourses: Course[] = [];
  selectedCourseId: string = '';
  submissions: Submission[] = [];
  currentemail: any;
  assignment: Assignment = {
    name: '',
    description: '',
    course_id: '',
    material_link: 'test',
    deadline: '',
    studentUploads: [],
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private storage: AngularFireStorage,
    private firestore: AngularFirestore
  ) { }

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
    if (email) {
      this.authService.getID(email).subscribe((response) => {
        this.id = response.id;

        this.authService.teacherAssignmentsSubmissions(this.id).subscribe(submissions => {
          this.submissions = submissions;
        });
      });
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
    const userId = this.assignment.assignment_id;
    const storageRef = this.storage.ref(`assignments/${userId}`).child(this.file.name);
    const uploadTask = storageRef.put(this.file);
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe((downloadURL) => {
          const encodedDownloadURL = encodeURIComponent(downloadURL);
          this.authService
            .updateAssignmentLink(encodedDownloadURL, userId)
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
    const userId = this.assignment.assignment_id;
    const storageRef = this.storage.ref(`assignment/${userId}`).child(this.file.name);
    const uploadTask = storageRef.put(this.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe((downloadURL) => {
          const encodedDownloadURL = (downloadURL);
          this.assignment.material_link = encodedDownloadURL;
          this.authService.addAssignment(this.assignment).subscribe(
            () => {
              this.successMessage = 'Assignment added successfully';
            },
            (error) => {
              if (
                error.error &&
                error.error.message &&
                error.error.message === 'Assignment already exists'
              ) {
                this.errorMessage = 'Assignment with this name already exists';
              } else {
                this.errorMessage = 'An error occurred during assignment creation. Please try again later.';
              }
            }
          );
        });
      })
    ).subscribe();
  }

}
