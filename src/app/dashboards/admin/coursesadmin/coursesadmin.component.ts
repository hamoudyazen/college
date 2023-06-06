
import { Component, OnInit } from '@angular/core';
import { Course, User } from 'src/app/models/allModels';
import { AuthService } from 'src/app/services/AuthService';
import { SharedService } from 'src/app/services/SharedService';

@Component({
  selector: 'app-coursesadmin',
  templateUrl: './coursesadmin.component.html',
  styleUrls: ['./coursesadmin.component.css']
})
export class CoursesadminComponent {
  userDetails: any;
  allUsers: User[] = [];
  allCourses: Course[] = [];

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

  deleteCourse(courseID: any) {
    this.authService.deleteCourseAdmin(courseID).subscribe(response => {
      location.reload();
    });
  }



}
