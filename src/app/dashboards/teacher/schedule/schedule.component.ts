import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/AuthService';
import { Course, PublicSchedule } from 'src/app/models/allModels';
import { User } from 'src/app/models/allModels';

interface CourseSchudle {
  courseName: string;
  courseHours: number;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  currentMajor: string = '';


  sunday: CourseSchudle[] = [];
  monday: CourseSchudle[] = [];
  tuesday: CourseSchudle[] = [];
  wednesday: CourseSchudle[] = [];
  thursday: CourseSchudle[] = [];
  friday: CourseSchudle[] = [];
  allCourses: CourseSchudle[] = [];
  allCoursesBackUp: CourseSchudle[] = [];
  sundayHours: number = 0;
  mondayHours: number = 0;
  tuesdayHours: number = 0;
  wednesdayHours: number = 0;
  thursdayHours: number = 0;
  fridayHours: number = 0;

  majorCoursesIds: string[] = [];
  majorCourses: Course[] = [];
  courseDetails: Course[] = [];


  firstCourseDetails!: Course[];
  secondCourseDetails!: Course[];
  thirdCourseDetails!: Course[];
  fourthCourseDetails!: Course[];
  fifthCourseDetails!: Course[];


  firstCourse: CourseSchudle = { courseName: '', courseHours: 0 };
  secondCourse: CourseSchudle = { courseName: '', courseHours: 8 };
  thirdCourse: CourseSchudle = { courseName: '', courseHours: 0 };
  fourthCourse: CourseSchudle = { courseName: '', courseHours: 0 };
  fifthCourse: CourseSchudle = { courseName: '', courseHours: 0 };

  currentEmail: any;
  email: any;
  userDetails: User[] = [];
  constructor(private AuthService: AuthService) { }
  ngOnInit(): void {


    this.currentEmail = localStorage.getItem('email');
    this.AuthService.getUserDetails(this.currentEmail).subscribe(
      response => {
        this.userDetails = response;
        localStorage.setItem('userDetails', JSON.stringify(this.userDetails));
        this.currentMajor = this.userDetails[0].major;
      },
    );


    ////
    this.AuthService.getMajorCourses('Computer Science').subscribe(response => {
      this.majorCoursesIds = response;
      this.getFirstCourseDetails(response[0]);
      this.getSecondCourseDetails(response[1]);
      this.getThirdCourseDetails(response[2]);
      this.getFourthCourseDetails(response[3]);
      this.getFifthCourseDetails(response[4]);
    });

  }





  getFirstCourseDetails(id: string) {
    this.AuthService.getCourseDetails(id).subscribe(
      response => {
        this.firstCourseDetails = response;
        console.log('hope', this.firstCourseDetails);
        this.firstCourse = { courseName: response[0].name, courseHours: response[0].semesterHours };
        this.checkAllCoursesInitialized(); // Check if all courses are initialized

      },
    );
  }


  getSecondCourseDetails(id: string) {
    this.AuthService.getCourseDetails(id).subscribe(
      response => {
        this.secondCourseDetails = response;
        this.secondCourse.courseName = response[0].name;
        this.secondCourse.courseHours = response[0].semesterHours;
        this.checkAllCoursesInitialized(); // Check if all courses are initialized
      },
    );
  }
  getThirdCourseDetails(id: string) {
    this.AuthService.getCourseDetails(id).subscribe(
      response => {
        this.thirdCourseDetails = response;
        this.thirdCourse.courseName = response[0].name;
        this.thirdCourse.courseHours = response[0].semesterHours;
        this.checkAllCoursesInitialized(); // Check if all courses are initialized
      },
    );
  }
  getFourthCourseDetails(id: string) {
    this.AuthService.getCourseDetails(id).subscribe(
      response => {
        this.fourthCourseDetails = response;
        this.fourthCourse.courseName = response[0].name;
        this.fourthCourse.courseHours = response[0].semesterHours;
        this.checkAllCoursesInitialized(); // Check if all courses are initialized
      },
    );
  }
  getFifthCourseDetails(id: string) {
    this.AuthService.getCourseDetails(id).subscribe(
      response => {
        this.fifthCourseDetails = response;
        this.fifthCourse.courseName = response[0].name;
        this.fifthCourse.courseHours = response[0].semesterHours;
        this.checkAllCoursesInitialized(); // Check if all courses are initialized
      },
    );


  }



  checkAllCoursesInitialized() {
    if (
      this.firstCourseDetails &&
      this.secondCourseDetails &&
      this.thirdCourseDetails &&
      this.fourthCourseDetails &&
      this.fifthCourseDetails
    ) {
      this.generateSchedule();
    }
  }



  generateSchedule() {
    this.allCourses.push(this.firstCourse);
    this.allCourses.push(this.secondCourse);
    this.allCourses.push(this.thirdCourse);
    this.allCourses.push(this.fourthCourse);
    this.allCourses.push(this.fifthCourse);



    const remainingCourses: CourseSchudle[] = this.allCourses.map((CourseSchudle) => ({ ...CourseSchudle }));

    for (let j = 0; j < remainingCourses.length - 1; j++) {
      for (let i = 0; i < remainingCourses.length - j - 1; i++) {
        if (remainingCourses[i].courseHours > remainingCourses[i + 1].courseHours) {
          const temp = remainingCourses[i];
          remainingCourses[i] = remainingCourses[i + 1];
          remainingCourses[i + 1] = temp;
        }
      }
    }


    //fill for sunday till full
    for (let i = 0; i < remainingCourses.length; i++) {
      if (this.sundayHours < 8) {
        const currentCourse = remainingCourses[i];
        let remainingHours = currentCourse.courseHours;

        while (remainingHours > 0 && this.sundayHours < 8) {
          const hoursToAdd = Math.min(remainingHours, 2, 8 - this.sundayHours);
          remainingHours -= hoursToAdd;
          this.sundayHours += hoursToAdd;
          this.sunday.push({
            courseName: currentCourse.courseName,
            courseHours: hoursToAdd
          });
        }

        currentCourse.courseHours = remainingHours;

        if (remainingHours === 0) {
          remainingCourses.splice(i, 1);
          i--;
        }
      }
    }



    //fill for monday till full
    for (let i = 0; i < remainingCourses.length; i++) {
      if (this.mondayHours < 8) {
        const currentCourse = remainingCourses[i];
        let remainingHours = currentCourse.courseHours;

        while (remainingHours > 0 && this.mondayHours < 8) {
          const hoursToAdd = Math.min(remainingHours, 2, 8 - this.mondayHours);
          remainingHours -= hoursToAdd;
          this.mondayHours += hoursToAdd;
          this.monday.push({
            courseName: currentCourse.courseName,
            courseHours: hoursToAdd
          });
        }

        currentCourse.courseHours = remainingHours;

        if (remainingHours === 0) {
          remainingCourses.splice(i, 1);
          i--;
        }
      }
    }



    //fill for tuesday till full
    for (let i = 0; i < remainingCourses.length; i++) {
      if (this.tuesdayHours < 8) {
        const currentCourse = remainingCourses[i];
        let remainingHours = currentCourse.courseHours;
        while (remainingHours > 0 && this.tuesdayHours < 8) {
          const hoursToAdd = Math.min(remainingHours, 2, 8 - this.tuesdayHours);
          remainingHours -= hoursToAdd;
          this.tuesdayHours += hoursToAdd;
          this.tuesday.push({
            courseName: currentCourse.courseName,
            courseHours: hoursToAdd
          });
        }

        currentCourse.courseHours = remainingHours;

        if (remainingHours === 0) {
          remainingCourses.splice(i, 1);
          i--;
        }
      }
    }


    //fill for wednesday till full
    for (let i = 0; i < remainingCourses.length; i++) {
      if (this.wednesdayHours < 8) {
        const currentCourse = remainingCourses[i];
        let remainingHours = currentCourse.courseHours;
        while (remainingHours > 0 && this.wednesdayHours < 8) {
          const hoursToAdd = Math.min(remainingHours, 2, 8 - this.wednesdayHours);
          remainingHours -= hoursToAdd;
          this.wednesdayHours += hoursToAdd;
          this.wednesday.push({
            courseName: currentCourse.courseName,
            courseHours: hoursToAdd
          });
        }

        currentCourse.courseHours = remainingHours;

        if (remainingHours === 0) {
          remainingCourses.splice(i, 1);
          i--;
        }
      }
    }



    //fill for thursday till full
    for (let i = 0; i < remainingCourses.length; i++) {
      if (this.thursdayHours < 8) {
        const currentCourse = remainingCourses[i];
        let remainingHours = currentCourse.courseHours;
        while (remainingHours > 0 && this.thursdayHours < 8) {
          const hoursToAdd = Math.min(remainingHours, 2, 8 - this.thursdayHours);
          remainingHours -= hoursToAdd;
          this.thursdayHours += hoursToAdd;
          this.thursday.push({
            courseName: currentCourse.courseName,
            courseHours: hoursToAdd
          });
        }

        currentCourse.courseHours = remainingHours;

        if (remainingHours === 0) {
          remainingCourses.splice(i, 1);
          i--;
        }
      }
    }




    //fill for friday till full
    for (let i = 0; i < remainingCourses.length; i++) {
      if (this.fridayHours < 8) {
        const currentCourse = remainingCourses[i];
        let remainingHours = currentCourse.courseHours;
        while (remainingHours > 0 && this.fridayHours < 8) {
          const hoursToAdd = Math.min(remainingHours, 2, 8 - this.fridayHours);
          remainingHours -= hoursToAdd;
          this.fridayHours += hoursToAdd;
          this.friday.push({
            courseName: currentCourse.courseName,
            courseHours: hoursToAdd
          });
        }

        currentCourse.courseHours = remainingHours;

        if (remainingHours === 0) {
          remainingCourses.splice(i, 1);
          i--;
        }
      }
    }

  }

  sundayCheckHours() {
    return this.sundayHours;
  }

  mondayCheckHours() {
    return this.mondayHours;
  }

  tuesdayCheckHours() {
    return this.tuesdayHours;
  }

  wednesdayCheckHours() {
    return this.wednesdayHours;
  }

  thursdayCheckHours() {
    return this.thursdayHours;
  }





}
