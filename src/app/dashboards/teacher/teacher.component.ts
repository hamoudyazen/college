import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService';
import { SharedService } from 'src/app/services/SharedService';
import { Course, Major, User } from 'src/app/models/allModels';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {

  pagename: string = '';
  showRegisterCourse: boolean = false;
  showTeacherCourse: boolean = false;
  showAssignment: boolean = false;
  showSchedule: boolean = true;
  showProfile: boolean = false;
  activeLink: string = 'courses';

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

  majorId: any;
  allUsers: any;
  currentMajorDetails: Major[] = [];
  isBeingEdited: boolean = true;
  private pageRefreshed: boolean = false; // Flag to track if page has been refreshed

  constructor(
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService
  ) { }

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

      for (let i = 0; i < this.allUsers.length; i++) {
        if (this.allUsers[i].editingSchedule === true) {
          this.isBeingEdited = false;
        }
      }

      this.currentMajorDetails = await this.sharedService.getMajorDetails();
      this.majorId = this.currentMajorDetails[0].id;

      this.authService.getMajorDetails(this.major).subscribe(response => {
        this.majorId = response[0].id;
      });
    } catch (error) {
      console.error('Error retrieving data:', error);
    }

    if (!navigator.onLine) {
      this.handleUserDisconnect();
    }
  }

  @HostListener('window:beforeunload')
  beforeUnloadHandler() {
    this.handleUserDisconnect();
  }

  @HostListener('window:offline')
  offlineHandler() {
    this.handleUserDisconnect();
  }

  handleUserDisconnect() {
    this.changeStatusFalse();
  }

  toggleComponent(component: string): void {
    this.showRegisterCourse = false;
    this.showTeacherCourse = false;
    this.showProfile = false;
    this.showAssignment = false;
    this.showSchedule = false;
    this.activeLink = component;

    if (component === 'Add Course') {
      this.showRegisterCourse = true;
      this.changeStatusFalse();
      this.pagename = 'Add Course';
      this.activeLink = 'Add Course';
    } else if (component === 'My Courses') {
      this.showTeacherCourse = true;
      this.changeStatusFalse();
      this.pagename = 'My Courses';
      this.activeLink = 'My Courses';
    } else if (component === 'Profile') {
      this.showProfile = true;
      this.changeStatusFalse();
      this.pagename = 'Profile';
      this.activeLink = 'Profile';
    } else if (component === 'Assignment') {
      this.showAssignment = true;
      this.changeStatusFalse();
      this.pagename = 'Add Assignment';
      this.activeLink = 'Add Assignment';
    } else if (component === 'Schedule') {
      this.showSchedule = true;
      this.chageStatus();
      this.pagename = 'Schedule';
      this.activeLink = 'Schedule';
    }
  }

  logOut() {
    this.changeStatusFalse();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  chageStatus() {
    this.authService.updateScheduleEditStatus(this.userDetails[0].id!, true).subscribe(response => {
    });
  }

  changeStatusFalse() {
    this.authService.updateScheduleEditStatus(this.userDetails[0].id!, false).subscribe(response => {

    });
  }
}
