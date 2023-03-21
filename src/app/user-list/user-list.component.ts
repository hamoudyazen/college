import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { AuthService } from '../AuthService';
import { Course } from '../courses';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  courses: Course[] | undefined;
  current_students : any;

  constructor(private userService: AuthService) { }

  ngOnInit() {
    this.userService.getAllCourses().subscribe(courses => {
      this.courses = courses;
    });

  }


}
