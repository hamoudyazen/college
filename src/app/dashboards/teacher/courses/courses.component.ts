import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/AuthService';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  constructor(private userService: AuthService) { }

  ngOnInit() {


  }

}
