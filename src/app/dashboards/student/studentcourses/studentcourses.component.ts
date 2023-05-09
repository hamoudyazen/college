import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/AuthService';
import { Assignment, Course, Submission, ForgotPasswordResponse, CourseMaterial, LoginRequest, User } from 'src/app/models/allModels';

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

  courseMaterial: CourseMaterial[] = [];


  constructor(private AuthService: AuthService) { }

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    this.currentemail = email;
    this.AuthService.StudentCourses(this.currentemail).subscribe(courses => {
      this.courseList = courses;
    });

    this.AuthService.showAllCourseMaterials().subscribe(courseMaterials => {
      this.courseMaterial = courseMaterials;
    });
  };


}
