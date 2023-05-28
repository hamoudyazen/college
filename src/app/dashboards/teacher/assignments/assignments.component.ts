import { Component, OnInit } from '@angular/core';
import { Toast } from 'bootstrap';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Assignment, Course, Submission, ForgotPasswordResponse, CourseMaterial, LoginRequest, User } from 'src/app/models/allModels';
import { SharedService } from 'src/app/services/SharedService';

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
    private firestore: AngularFirestore,
    private SharedService: SharedService
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      this.userDetails = await this.SharedService.getUserDetails();
      this.teacherCourses = await this.SharedService.getTeacherCourses();
      this.submissions = await this.SharedService.getTeacherAssignmentsSubmissions(this.userDetails[0].id!);

    } catch (error) {
      console.error('Error retrieving data:', error);
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


  onSubmit(): void {
    if (this.assignment.deadline < new Date().toISOString()) {
      alert('Deadline cannot be in the past');
      return;
    }
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
              alert('Assignment added successfully');
              window.location.reload();
            }
          );
        });
      })
    ).subscribe();
  }

}
