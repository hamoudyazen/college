import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService';
import { SharedService } from 'src/app/services/SharedService';
import { Course, Major, User } from 'src/app/models/allModels';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  pagename: string = '';
  showStudents: boolean = false;
  showCourses: boolean = false;
  showSchedules: boolean = false;
  showProfile: boolean = false;
  showChat: boolean = true;

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
  }



  toggleComponent(component: string): void {
    this.showStudents = false;
    this.showCourses = false;
    this.showProfile = false;
    this.showSchedules = false;
    this.showChat = false;

    this.activeLink = component;

    if (component === 'Students') {
      this.showStudents = true;
      this.showCourses = false;
      this.showProfile = false;
      this.showSchedules = false;
      this.showChat = false;
      this.pagename = 'Students';
      this.activeLink = 'Students';
    }
    else if (component === 'Courses') {
      this.showStudents = false;
      this.showCourses = true;
      this.showProfile = false;
      this.showSchedules = false;
      this.showChat = false;
      this.pagename = 'Courses';
      this.activeLink = 'Courses';
    }
    else if (component === 'Profile') {
      this.showStudents = false;
      this.showCourses = false;
      this.showProfile = true;
      this.showSchedules = false;
      this.showChat = false;
      this.pagename = 'Profile';
      this.activeLink = 'Profile';
    } else if (component === 'Schedules') {
      this.showStudents = false;
      this.showCourses = false;
      this.showProfile = false;
      this.showSchedules = true;
      this.showChat = false;
      this.pagename = 'Profile';
      this.activeLink = 'Profile';
    } else if (component === 'Chat') {
      this.showStudents = false;
      this.showCourses = false;
      this.showProfile = false;
      this.showSchedules = false;
      this.showChat = true;
      this.pagename = 'Chat';
      this.activeLink = 'Chat';
    }

  }
  logOut() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
