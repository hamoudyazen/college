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
  currentEmail: any;
  semester: any;
  date !: Date;
  userDetails: User[] = [];

  currentId: any;

  showModal: boolean[] = [];

  teacherCourses: Course[] = [];
  id: string | undefined;
  courseID: any;


  courseMaterial: CourseMaterial = {
    materialCourseLink: '',
    materialCourseId: '',
    materialCourseName: '',
    materialCourseDescription: '',
  };

  onModalShow(index: number) {
    this.showModal[index] = true;
  }

  onModalHide(index: number) {
    this.showModal[index] = false;
  }


  constructor(private authService: AuthService, private storage: AngularFireStorage, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.currentEmail = localStorage.getItem('email');
    this.authService.getUserDetails(this.currentEmail).subscribe(
      response => {
        this.userDetails = response;
        localStorage.setItem('userDetails', JSON.stringify(this.userDetails));
        this.currentId = this.userDetails[0].id;
        this.major = this.userDetails[0].major;

        this.authService.getTeacherCourses(this.currentId).subscribe(response => {
          console.log(this.currentId);
          this.teacherCourses = response;
        });
      }
    );

    const date = new Date();
    const month = date.getMonth() + 1;

    if (month >= 10 || month < 4) {
      this.semester = 'winter';
    } else {
      this.semester = 'summer';
    }
  }



  updateStudent(formData: any, student: any, originalEmail: string) {
    const newEmail = formData.email;

    if (this.courseID) {
      this.authService.updateEmail(this.courseID, originalEmail, newEmail)
        .subscribe(
          (response) => {
            // Update the corresponding student email in the array
            const index = this.teacherCourses.findIndex(course => course.id === this.courseID);
            const studentIndex = this.teacherCourses[index].studentsArray.indexOf(originalEmail);
            this.teacherCourses[index].studentsArray[studentIndex] = newEmail;
            window.location.reload();

          },
          (error) => {
            alert('error');
          }
        );
    }
  }

  deleteStudent(email: string) {
    if (this.courseID) {
      this.authService.deleteEmail(this.courseID, email)
        .subscribe(
          (response) => {
            // Remove the corresponding student email from the array
            const index = this.teacherCourses.findIndex(course => course.id === this.courseID);
            const studentIndex = this.teacherCourses[index].studentsArray.indexOf(email);
            this.teacherCourses[index].studentsArray.splice(studentIndex, 1);
            window.location.reload();

          },
          (error) => {
            alert('error');
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
                this.teacherCourses.find(course => course.id === this.courseID)?.studentsArray.push(newEmail);
                addStudentForm.resetForm(); // Clear the input field
                window.location.reload();
              },
              (error) => {
                alert('error');
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
