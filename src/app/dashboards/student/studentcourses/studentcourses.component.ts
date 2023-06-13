import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/AuthService';
import { Assignment, Course, Submission, ForgotPasswordResponse, CourseMaterial, User, uploadZoomTeacher } from 'src/app/models/allModels';
import { SharedService } from 'src/app/services/SharedService';
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
  userDetails: User[] = [];
  courseMaterial: CourseMaterial[] = [];
  allZoomLinks: uploadZoomTeacher[] = [];
  dataLoaded: boolean = false;

  constructor(private AuthService: AuthService, private SharedService: SharedService) { }

  async ngOnInit(): Promise<void> {
    try {
      this.userDetails = await this.SharedService.getUserDetails();
      this.courseList = await this.SharedService.StudentCourses(this.userDetails[0].email);
      this.courseMaterial = await this.SharedService.showAllCourseMaterials();


      this.allZoomLinks = await this.SharedService.getAllZoomLinks();
      this.dataLoaded = true;

    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }

  openWebPage(link: string): void {
    window.open(link, '_blank');
  }
  openZoomLink(courseName: string) {
    const zoomLinkUrl = this.allZoomLinks.find(item => item.courseName === courseName);
    if (zoomLinkUrl) {
      this.openWebPage(zoomLinkUrl.zoomLink);
    }
  }
}
