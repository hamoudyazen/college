import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/Course';
import { AuthService } from 'src/app/AuthService';

@Component({
  selector: 'app-studentcourses',
  templateUrl: './studentcourses.component.html',
  styleUrls: ['./studentcourses.component.css']
})
export class StudentcoursesComponent implements OnInit {
  courseList!: Course[];
  currentemail!: any;
  successMessage: any;
  errorMessage: string | undefined;

  constructor(private AuthService: AuthService) { }

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    this.currentemail = email;
    this.AuthService.StudentCourses(this.currentemail).subscribe(courses => {
      this.courseList = courses;
    });
  }


}
