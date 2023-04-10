import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/Course';
import { AuthService } from 'src/app/AuthService';
import { NgForm } from '@angular/forms';
import { Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-teacher-my-courses',
  templateUrl: './teacher-my-courses.component.html',
  styleUrls: ['./teacher-my-courses.component.css']
})
export class TeacherMyCoursesComponent implements OnInit {
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
  constructor(private authService: AuthService) { }

  ngOnInit(): void {

    const email = localStorage.getItem('email');
    if (email) {
      this.authService.getID(email).subscribe(
        response => {
          this.id = response.id;

          this.authService.getTeacherCourses(this.id).subscribe(
            (courses) => {
              this.sucessmessage = response;
              this.teacherCourses = courses;
            },
            (error) => {
              this.errorMessage = error.message;
            }
          );
        }
      );
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


}
