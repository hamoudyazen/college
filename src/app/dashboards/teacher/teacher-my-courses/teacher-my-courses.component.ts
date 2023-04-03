import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/Course';
import { AuthService } from 'src/app/AuthService';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-teacher-my-courses',
  templateUrl: './teacher-my-courses.component.html',
  styleUrls: ['./teacher-my-courses.component.css']
})
export class TeacherMyCoursesComponent implements OnInit {
  teacherCourses: Course[] = [];
  id: string | undefined;
  courseID: any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {

    const email = localStorage.getItem('email');
    if (email) {
      this.authService.getID(email).subscribe(
        response => {
          this.id = response.id;

          this.authService.getTeacherCourses(this.id).subscribe(
            (courses) => {
              this.teacherCourses = courses;
            },
            (error) => {
              console.log("error");
            }
          );
        }
      );
    }
  }

  currentEmail: string = '';
  updateStudent(formData: any, student: any, originalEmail: string) {
    const newEmail = formData.email;
    console.log('newEmail', newEmail);
    console.log('course id', this.courseID);
    console.log('original email', originalEmail);

    if (this.courseID) {
      this.authService.updateEmail(this.courseID, originalEmail, newEmail)
        .subscribe(
          (response) => {
            console.log(response);
            // Update the corresponding student email in the array
            const index = this.teacherCourses.findIndex(course => course.id === this.courseID);
            const studentIndex = this.teacherCourses[index].studentsArray.indexOf(originalEmail);
            this.teacherCourses[index].studentsArray[studentIndex] = newEmail;
          },
          (error) => console.log(error)
        );
    }
  }

  deleteStudent(email: string) {
    if (this.courseID) {
      this.authService.deleteEmail(this.courseID, email)
        .subscribe(
          (response) => {
            console.log(response);
            // Remove the corresponding student email from the array
            const index = this.teacherCourses.findIndex(course => course.id === this.courseID);
            const studentIndex = this.teacherCourses[index].studentsArray.indexOf(email);
            this.teacherCourses[index].studentsArray.splice(studentIndex, 1);
          },
          (error) => console.log(error)
        );
    }
  }


  addStudent(addStudentForm: NgForm) {
    const newEmail = addStudentForm.value.email;
    console.log('newEmail', newEmail);
    console.log('course id', this.courseID);

    if (this.courseID) {
      this.authService.addStudent(this.courseID, newEmail).subscribe(
        (response) => {
          console.log(response);
          this.teacherCourses.find(course => course.id === this.courseID)?.studentsArray.push(newEmail);
          addStudentForm.resetForm(); // Clear the input field
        },
        (error) => {
          console.log(error);
          console.log(error.message);
        }
      );
    }
  }


}
