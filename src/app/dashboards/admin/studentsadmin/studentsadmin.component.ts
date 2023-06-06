import { Component, OnInit } from '@angular/core';
import { Course, User } from 'src/app/models/allModels';
import { AuthService } from 'src/app/services/AuthService';
import { SharedService } from 'src/app/services/SharedService';

@Component({
  selector: 'app-studentsadmin',
  templateUrl: './studentsadmin.component.html',
  styleUrls: ['./studentsadmin.component.css']
})
export class StudentsadminComponent implements OnInit {
  userDetails: any;
  allUsers: User[] = [];
  allCourses: Course[] = [];
  showStudentcoursesTable: boolean = false;
  studentIndex: number = 0;
  courseIndex: number = 0;
  userCourses: Course[] = [];
  user: User = {
    editingSchedule: false,
    firstname: '',
    lastname: '',
    birthday: new Date(),
    email: '',
    password: '',
    role: '',
    major: '',
    image: ''
  };
  constructor(private authService: AuthService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      this.userDetails = await this.sharedService.getUserDetails();
      this.allUsers = await this.sharedService.getAllUsers();
      this.allCourses = await this.sharedService.getAllCoursesAdmin();
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }

  deleteUser(email: any) {
    this.authService.deleteUserAdmin(email).subscribe(response => {
      location.reload();

    });
  }

  updateUser(newEmail: any, i: number) {
    this.authService.updateUserEmailAdmin(this.allUsers[i].id!, newEmail).subscribe(response => {
      location.reload();
    });
  }

  promptEmail(i: number): void {
    const newEmail = prompt('Enter a new email:');
    if (newEmail) {
      this.saveEmail(newEmail, i);
    }
  }

  saveEmail(email: string, i: number): void {
    this.updateUser(email, i);
  }

  showStudentcoursesTableFunc(i: number) {
    this.studentIndex = i;

    this.authService.getUserCourses(this.allUsers[i].email).subscribe(response => {
      this.userCourses = response;
      this.authService.getStudentCoursesList(this.allUsers[i].email).subscribe(response => {
        this.userCourses = response;
      });

      this.showStudentcoursesTable = true;
    });
  }

  deleteUserFromCourse(courseID: string) {
    this.authService.deleteStudentFromCourse(this.allUsers[this.studentIndex].email, courseID).subscribe(response => {
      location.reload();
    });
  }



  onSubmit() {
    this.authService.register(this.user).subscribe(response => {
      alert(response);
    });
  }

}
