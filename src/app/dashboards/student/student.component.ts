import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService';
import { SharedService } from 'src/app/services/SharedService';
import { Course, Major, User } from 'src/app/models/allModels';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  // Shared properties
  userDetails: User[] = [];
  email: any;
  id: any;
  firstname: any;
  lastname: any;
  role: any;
  name: any;
  profileImg: any;
  major: any;
  semester: any;
  // End of shared properties
  pagename: string = '';
  navbarCollapsed = true;
  isSmallScreen!: boolean;
  showAssignments: boolean = false;
  showStudentCourses: boolean = false;
  showAllAvailableCourses: boolean = false;
  showStudentSchedule: boolean = false;
  showFinancial: boolean = true;
  showProfile: boolean = false;
  showChat: boolean = false;

  activeLink: string = '';
  currentEmail: any;
  majorId: any;
  allUsers: any;
  currentMajorDetails: Major[] = [];

  constructor(private router: Router, private authService: AuthService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      this.userDetails = await this.sharedService.getUserDetails();
      this.email = this.sharedService.email;
      this.id = this.sharedService.id;
      this.firstname = this.sharedService.firstname;
      this.lastname = this.sharedService.lastname;
      this.role = this.sharedService.role;
      this.name = this.sharedService.name;
      this.profileImg = this.sharedService.profileImg;
      this.major = this.sharedService.major;
      this.semester = this.sharedService.semester;

      await this.authService.getMajorDetails(this.major).toPromise(); // Wait for the HTTP request to complete
      this.allUsers = await this.sharedService.getAllUsers();
      this.currentMajorDetails = await this.sharedService.getMajorDetails();
      this.majorId = this.currentMajorDetails[0].id;
      this.authService.getMajorDetails(this.major).subscribe(response => {
        this.majorId = response[0].id;
      });
    } catch (error) {
      console.error('Error retrieving data:', error);
    }

  }



  toggleComponent(component: string): void {
    this.showAssignments = false;
    this.showStudentCourses = false;
    this.showAllAvailableCourses = false;
    this.showStudentSchedule = false;
    this.showFinancial = false;
    this.showProfile = false;
    this.showChat = false;
    this.activeLink = component;

    if (component === 'showAssignments') {
      this.showAssignments = true;
      this.showStudentCourses = false;
      this.showAllAvailableCourses = false;
      this.showStudentSchedule = false;
      this.showFinancial = false;
      this.showProfile = false;
      this.showChat = false;
      this.activeLink = component;
    }
    else if (component === 'showStudentCourses') {
      this.showAssignments = false;
      this.showStudentCourses = true;
      this.showAllAvailableCourses = false;
      this.showStudentSchedule = false;
      this.showFinancial = false;
      this.showProfile = false;
      this.showChat = false;
      this.activeLink = component;
    }
    else if (component === 'showAllAvailableCourses') {
      this.showAssignments = false;
      this.showStudentCourses = false;
      this.showAllAvailableCourses = true;
      this.showStudentSchedule = false;
      this.showFinancial = false;
      this.showProfile = false;
      this.showChat = false;
      this.activeLink = component;
    }
    else if (component === 'showStudentSchedule') {
      this.showAssignments = false;
      this.showStudentCourses = false;
      this.showAllAvailableCourses = false;
      this.showStudentSchedule = true;
      this.showFinancial = false;
      this.showProfile = false;
      this.showChat = false;
      this.activeLink = component;
    }
    else if (component === 'showFinancial') {
      this.showAssignments = false;
      this.showStudentCourses = false;
      this.showAllAvailableCourses = false;
      this.showStudentSchedule = false;
      this.showFinancial = true;
      this.showProfile = false;
      this.showChat = false;
      this.activeLink = component;
    }
    else if (component === 'showProfile') {
      this.showAssignments = false;
      this.showStudentCourses = false;
      this.showAllAvailableCourses = false;
      this.showStudentSchedule = false;
      this.showFinancial = false;
      this.showProfile = true;
      this.showChat = false;
      this.activeLink = component;
    }
    else if (component === 'Chat') {
      this.showAssignments = false;
      this.showStudentCourses = false;
      this.showAllAvailableCourses = false;
      this.showStudentSchedule = false;
      this.showFinancial = false;
      this.showProfile = false;
      this.showChat = true;
      this.activeLink = component;
    }

  }
  logOut() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

