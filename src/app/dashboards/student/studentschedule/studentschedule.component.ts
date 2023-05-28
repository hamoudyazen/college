import { Component, OnInit } from '@angular/core';
import { CourseInsideMajor, Major, User } from 'src/app/models/allModels';
import { SharedService } from 'src/app/services/SharedService';
import { AuthService } from 'src/app/services/AuthService';

@Component({
  selector: 'app-studentschedule',
  templateUrl: './studentschedule.component.html',
  styleUrls: ['./studentschedule.component.css']
})
export class StudentscheduleComponent implements OnInit {
  days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  timeSlots: string[] = ['8:00-9:00AM', '9:10-10:10AM', '10:20-11:20AM', '11:30-12:30PM', '12:40-13:40PM', '13:50-14:50PM', '15:00-16:00PM', '17:10-18:10PM'];
  userDetails: User[] = [];
  userRegisteredCourses: any[] = [];
  majorArray: Major[] = [];
  teacherCourses: any[] = [];
  constructor(private AuthService: AuthService, private SharedService: SharedService) { }

  async ngOnInit(): Promise<void> {
    try {
      this.userDetails = await this.SharedService.getUserDetails()
      this.userRegisteredCourses = await this.SharedService.getStudentCourses();
      this.majorArray = await this.SharedService.getMajorDetails();
      this.teacherCourses = await this.SharedService.getCourseTeacher(this.userRegisteredCourses);
      console.log('test here', this.teacherCourses);
    } catch (error) {
      console.error('Error retrieving data:', error);
    }

  }


  getCourseId(day: string, timeSlot: string): string {
    let courseTitle = '';

    if (day === 'Sunday') {
      for (let i = 0; i < this.majorArray[0].schedule.sunday.length; i++) {
        if (timeSlot === this.majorArray[0].schedule.sunday[i].timeSlot) {
          const courseId = this.majorArray[0].schedule.sunday[i].courseId;
          const courseExists = this.userRegisteredCourses.some(course => course === courseId);
          if (courseExists) {
            courseTitle = this.majorArray[0].schedule.sunday[i].title;
          }
          else if (this.teacherCourses.includes(courseId)) {
            courseTitle = this.majorArray[0].schedule.sunday[i].title + '(Event)';
          }
          break;
        }
      }
    }
    else if (day === 'Monday') {
      for (let i = 0; i < this.majorArray[0].schedule.monday.length; i++) {
        if (timeSlot === this.majorArray[0].schedule.monday[i].timeSlot) {
          const courseId = this.majorArray[0].schedule.monday[i].courseId;
          const courseExists = this.userRegisteredCourses.some(course => course === courseId);
          if (courseExists) {
            courseTitle = this.majorArray[0].schedule.monday[i].title;
          }
          else if (this.teacherCourses.includes(courseId)) {
            courseTitle = this.majorArray[0].schedule.monday[i].title + '(Event)';
          }
          break;
        }
      }
    }
    else if (day === 'Tuesday') {
      for (let i = 0; i < this.majorArray[0].schedule.tuesday.length; i++) {
        if (timeSlot === this.majorArray[0].schedule.tuesday[i].timeSlot) {
          const courseId = this.majorArray[0].schedule.tuesday[i].courseId;
          const courseExists = this.userRegisteredCourses.some(course => course === courseId);
          if (courseExists) {
            courseTitle = this.majorArray[0].schedule.tuesday[i].title;
          }
          else if (this.teacherCourses.includes(courseId)) {
            courseTitle = this.majorArray[0].schedule.tuesday[i].title + '(Event)';
          }
          break;
        }
      }
    }
    else if (day === 'Wednesday') {
      for (let i = 0; i < this.majorArray[0].schedule.wednesday.length; i++) {
        if (timeSlot === this.majorArray[0].schedule.wednesday[i].timeSlot) {
          const courseId = this.majorArray[0].schedule.wednesday[i].courseId;
          const courseExists = this.userRegisteredCourses.some(course => course === courseId);
          if (courseExists) {
            courseTitle = this.majorArray[0].schedule.wednesday[i].title;
          }
          else if (this.teacherCourses.includes(courseId)) {
            courseTitle = this.majorArray[0].schedule.wednesday[i].title + '(Event)';
          }
          break;
        }
      }
    } else if (day === 'Thursday') {
      for (let i = 0; i < this.majorArray[0].schedule.thursday.length; i++) {
        if (timeSlot === this.majorArray[0].schedule.thursday[i].timeSlot) {
          const courseId = this.majorArray[0].schedule.thursday[i].courseId;
          const courseExists = this.userRegisteredCourses.some(course => course === courseId);
          if (courseExists) {
            courseTitle = this.majorArray[0].schedule.thursday[i].title;
          }
          else if (this.teacherCourses.includes(courseId)) {
            courseTitle = this.majorArray[0].schedule.thursday[i].title + '(Event)';
          }
          break;
        }
      }
    } else if (day === 'Friday') {
      for (let i = 0; i < this.majorArray[0].schedule.friday.length; i++) {
        if (timeSlot === this.majorArray[0].schedule.friday[i].timeSlot) {
          const courseId = this.majorArray[0].schedule.friday[i].courseId;
          const courseExists = this.userRegisteredCourses.some(course => course === courseId);
          if (courseExists) {
            courseTitle = this.majorArray[0].schedule.friday[i].title;
          }
          else if (this.teacherCourses.includes(courseId)) {
            courseTitle = this.majorArray[0].schedule.friday[i].title + '(Event)';
          }
          break;
        }
      }
    }
    return courseTitle;
  }


  getRoom(day: string, timeSlot: string): string {
    for (let i = 0; i < this.majorArray[0].schedule.sunday.length; i++) {
      if (day === 'Sunday') {
        if (timeSlot === this.majorArray[0].schedule.sunday[i].timeSlot) {
          return 'Room: ' + this.majorArray[0].schedule.sunday[i].room.toString();
        }
      }
    }
    for (let i = 0; i < this.majorArray[0].schedule.monday.length; i++) {
      if (day === 'Monday') {
        if (timeSlot === this.majorArray[0].schedule.monday[i].timeSlot) {
          return "Room: " + this.majorArray[0].schedule.monday[i].room.toString();
        }
      }
    }
    for (let i = 0; i < this.majorArray[0].schedule.tuesday.length; i++) {
      if (day === 'Tuesday') {
        if (timeSlot === this.majorArray[0].schedule.tuesday[i].timeSlot) {
          return "Room: " + this.majorArray[0].schedule.tuesday[i].room.toString();
        }
      }
    }
    for (let i = 0; i < this.majorArray[0].schedule.wednesday.length; i++) {
      if (day === 'Wednesday') {
        if (timeSlot === this.majorArray[0].schedule.wednesday[i].timeSlot) {
          return "Room: " + this.majorArray[0].schedule.wednesday[i].room.toString();
        }
      }
    }
    for (let i = 0; i < this.majorArray[0].schedule.thursday.length; i++) {
      if (day === 'Thursday') {
        if (timeSlot === this.majorArray[0].schedule.thursday[i].timeSlot) {
          return "Room: " + this.majorArray[0].schedule.thursday[i].room.toString();
        }
      }
    }
    for (let i = 0; i < this.majorArray[0].schedule.friday.length; i++) {
      if (day === 'Friday') {
        if (timeSlot === this.majorArray[0].schedule.friday[i].timeSlot) {
          return "Room: " + this.majorArray[0].schedule.friday[i].room.toString();
        }
      }
    }
    return "";
  }





}
