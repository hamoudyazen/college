import { Component } from '@angular/core';
import { Course, User, Grade } from 'src/app/models/allModels';
import { AuthService } from 'src/app/services/AuthService';
import { SharedService } from 'src/app/services/SharedService';

@Component({
  selector: 'app-student-grades',
  templateUrl: './student-grades.component.html',
  styleUrls: ['./student-grades.component.css']
})
export class StudentGradesComponent {
  userDetails: User[] = [];
  studentCourses: Course[] = [];
  allGrades: Grade[] = [];
  courseGrades: Grade[] = [];
  dataloaded: boolean = false;
  showGradesTables: boolean = false;

  constructor(private SharedService: SharedService, private AuthService: AuthService) { }
  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      this.userDetails = await this.SharedService.getUserDetails();
      this.studentCourses = await this.SharedService.StudentCourses(this.userDetails[0].email);
      this.allGrades = await this.SharedService.getAllGrades();

      this.dataloaded = true;
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }

  showGrades(courseId: string) {
    this.courseGrades = this.allGrades.filter(item => item.courseId === courseId);
    this.showGradesTables = true;
  }

}
