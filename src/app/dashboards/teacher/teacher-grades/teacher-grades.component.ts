import { Component } from '@angular/core';
import { Course, User, Grade } from 'src/app/models/allModels';
import { AuthService } from 'src/app/services/AuthService';
import { SharedService } from 'src/app/services/SharedService';
@Component({
  selector: 'app-teacher-grades',
  templateUrl: './teacher-grades.component.html',
  styleUrls: ['./teacher-grades.component.css']
})
export class TeacherGradesComponent {
  userDetails: User[] = [];
  allCourses: Course[] = [];
  teacherCourses: Course[] = [];
  dataloaded: boolean = false;
  showStudentsTables: boolean = false;
  studentArray: String[] = [];
  gradeToUpload: Grade = {
    id: '',
    studentEmail: '',
    courseId: '',
    courseName: '',
    grade: 0
  }
  showGradesTables: boolean = false;
  studentGradesArray: Grade[] = [];
  selectedCourseName: string = "";
  selectedCourseId: string = "";
  selectedStudent: string = "";
  allGrades: Grade[] = [];
  constructor(private AuthService: AuthService, private SharedService: SharedService) { }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      this.userDetails = await this.SharedService.getUserDetails();
      this.allCourses = await this.SharedService.getAllCoursesAdmin();
      this.allGrades = await this.SharedService.getAllGrades();
      this.teacherCourses = this.filterCourses();

      this.dataloaded = true;
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }

  //add the courses to "teacherCourses"
  filterCourses() {
    return this.allCourses.filter(item => item.teacherID === this.userDetails[0].id);
  }

  showStudents(courseid: string) {
    this.showStudentsTables = true;
    this.selectedCourseId = courseid;

    const course = this.teacherCourses.find(item => item.id === courseid);
    if (course) {
      this.studentArray = course.studentsArray.filter(item => item);
      this.selectedCourseName = course.name;
    }
  }

  showStudentGrades(email: string) {
    this.selectedStudent = email;
    this.showGradesTables = true;

    this.studentGradesArray = this.allGrades.filter(item => item.studentEmail === email);

  }

  addNewGrade() {
    this.gradeToUpload.courseId = this.selectedCourseId;
    this.gradeToUpload.courseName = this.selectedCourseName;
    this.gradeToUpload.studentEmail = this.selectedStudent;

    this.AuthService.addGrade(this.gradeToUpload).subscribe(response => {
      console.log(response);
      location.reload();
    });
  }

  deleteGrade(id: string) {
    this.AuthService.deleteGrade(id).subscribe(response => {
      console.log(response);
      location.reload();
    });
  }
}

