import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/AuthService';
import { NgForm } from '@angular/forms';
import { Validators, FormControl } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Assignment, Course, Submission, ForgotPasswordResponse, CourseMaterial, LoginRequest, User } from 'src/app/models/allModels';
import { error } from 'jquery';

@Component({
  selector: 'app-teacher-my-courses',
  templateUrl: './teacher-my-courses.component.html',
  styleUrls: ['./teacher-my-courses.component.css']
})
export class TeacherMyCoursesComponent implements OnInit {
  public file: any = {};
  major: any;
  semester: any;
  date !: Date;
  userDetails: User[] = [];
  userDetailsStorage: User[] = [];

  showModal: boolean[] = [];
  onModalShow(index: number) {
    this.showModal[index] = true;
  }

  onModalHide(index: number) {
    this.showModal[index] = false;
  }
  teacherCourses: Course[] = [];
  id: string | undefined;
  courseID: any;
  errorMessage: any;
  sucessmessage: any;

  courseMaterial: CourseMaterial = {
    materialCourseLink: '',
    materialCourseId: '',
    materialCourseName: '',
    materialCourseDescription: '',
  };




  constructor(private authService: AuthService, private storage: AngularFireStorage, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    const userDetailsStorage = JSON.parse(localStorage.getItem('userDetails') || '{}');
    this.id = userDetailsStorage.id;
    this.major = userDetailsStorage.major;
    this.userDetails = Object.values(userDetailsStorage);

    this.authService.getTeacherCourses(userDetailsStorage.id).subscribe(response => {
      this.teacherCourses = response;
    }, error => {
      alert('error');
    });

    const date = new Date();
    const month = date.getMonth() + 1; // get current month (Jan is 0, Dec is 11)

    if (month >= 10 || month < 4) {
      this.semester = 'winter';
    } else {
      this.semester = 'summer';
    }


  }


  currentEmail: string = '';
  updateStudent(formData: any, student: any, originalEmail: string) {
    const newEmail = formData.email;

    if (this.courseID) {
      this.authService.updateEmail(this.courseID, originalEmail, newEmail)
        .subscribe(
          (response) => {
            this.sucessmessage = response;
            // Update the corresponding student email in the array
            const index = this.teacherCourses.findIndex(course => course.id === this.courseID);
            const studentIndex = this.teacherCourses[index].studentsArray.indexOf(originalEmail);
            this.teacherCourses[index].studentsArray[studentIndex] = newEmail;
            window.location.reload();

          },
          (error) => {
            this.errorMessage = error.message;
          }
        );
    }
  }

  deleteStudent(email: string) {
    if (this.courseID) {
      this.authService.deleteEmail(this.courseID, email)
        .subscribe(
          (response) => {
            this.sucessmessage = response;
            // Remove the corresponding student email from the array
            const index = this.teacherCourses.findIndex(course => course.id === this.courseID);
            const studentIndex = this.teacherCourses[index].studentsArray.indexOf(email);
            this.teacherCourses[index].studentsArray.splice(studentIndex, 1);
            window.location.reload();

          },
          (error) => {
            this.errorMessage = error.message;
          });
    }
  }


  addStudent(addStudentForm: NgForm) {
    const newEmail = addStudentForm.value.email;

    for (let i = 0; i < this.teacherCourses.length; i++) {
      if (this.teacherCourses[i].id === this.courseID) {
        if (this.teacherCourses[i].studentsArray.length < this.teacherCourses[i].capacity) {

          if (this.courseID) {
            this.authService.addStudent(this.courseID, newEmail).subscribe(
              (response) => {
                this.sucessmessage = response;
                this.teacherCourses.find(course => course.id === this.courseID)?.studentsArray.push(newEmail);
                addStudentForm.resetForm(); // Clear the input field
                window.location.reload();
              },
              (error) => {
                this.errorMessage = error.message;
              }
            );
          }
        }
      }
    }
  }



  ////material
  choseFile(event: any) {
    this.file = event.target.files[0];
  }
  addData() {
    const userId = this.courseMaterial.id;
    const storageRef = this.storage.ref(`CourseMaterial/${userId}`).child(this.file.name);
    const uploadTask = storageRef.put(this.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe((downloadURL) => {
          const encodedDownloadURL = encodeURIComponent(downloadURL);
          this.authService.updateAssignmentLink(encodedDownloadURL, userId).subscribe(() => {
            alert('Course Material updated successfully');
            window.location.reload();
          }, error => {
            alert('Error occurred during Course Material update');
          });
        });
      })
    ).subscribe();
  }


  onSubmit(): void {
    const userId = this.courseMaterial.id;
    const storageRef = this.storage.ref(`CourseMaterial/${userId}`).child(this.file.name);
    const uploadTask = storageRef.put(this.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe((downloadURL) => {
          const encodedDownloadURL = (downloadURL);
          this.courseMaterial.materialCourseLink = encodedDownloadURL;
          this.authService.addCourseMaterial(this.courseMaterial).subscribe(
            () => {
              alert('Course Material added successfully');
            },
            () => {
              alert('Course Material with this name already exists');
            }
          );
        });
      })
    ).subscribe();
  }


}
