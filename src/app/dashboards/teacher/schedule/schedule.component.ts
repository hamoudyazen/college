import { Component, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from 'src/app/services/AuthService';
import { Course, Major } from 'src/app/models/allModels';
import { User } from 'src/app/models/allModels';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';

interface CourseSchudle {
  courseName: string;
  courseHours: number;
}
export interface CourseInsideMajor {
  courseId: string;
  startTime: string;
  endTime: string;
}

interface CourseSchudleWithRoomsAndHours {
  courseName: string;
  courseHours: number;
  hoursArray: string[];
  roomsArray: string[];
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  timeSlots: string[] = ['8:00-9:00AM', '9:10-10:10AM', '10:20-11:20AM', '11:30-12:30PM', '12:40-13:40PM', '13:50-14:50PM', '15:00-16:00PM', '17:10-18:10PM'];
  showTimetable: boolean = false;
  currentMajor: string = '';
  currentEmail: any;
  currentHour: any;
  email: any;
  userDetails: User[] = [];
  currentMajorId: any;
  majors: any[] = [];
  selectedSlots: any[] = [];
  currentSch: Major[] = [];
  backupMajor: Major[] = [];
  coursesList: any[] = [];
  selectedSubject: any;
  isSubjectSelected: boolean = false;
  isUserEditing: boolean = false;
  isBeingEditedByOtherUser: boolean = false;

  constructor(private AuthService: AuthService, private renderer: Renderer2, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.currentEmail = localStorage.getItem('email');
    this.AuthService.getUserDetails(this.currentEmail).subscribe(
      response => {
        this.userDetails = response;
        if (this.userDetails.length > 0) {
          this.currentMajor = this.userDetails[0].major;
          this.AuthService.getMajorDetails(this.currentMajor).subscribe(response => {
            this.coursesList = response[0].coursesList;
            this.backupMajor = response;
            if (this.backupMajor.length > 0) {
              this.currentMajorId = this.backupMajor[0].id;
              this.isBeingEditedByOtherUser = this.backupMajor[0].isBeingEdited;
              if (this.isBeingEditedByOtherUser) {
                alert('This major is being edited by another user. try another time');
              }
              console.log('Current Major ID:', this.currentMajorId);
            } else {
              console.log('No major details found.');
            }
          });
        } else {
          console.log('No user details found.');
        }
      },
      error => {
        console.log('Error occurred while fetching user details:', error);
      }
    );
  }




  disableCheckbox(day: string, timeSlot: string) {
    if (day === 'Sunday') {
      for (let i = 0; i < this.backupMajor[0].schedule.sunday.length; i++) {
        if (timeSlot == this.backupMajor[0].schedule.sunday[i].timeSlot) {
          return true;
        }
      }
      return false;
    }
    else if (day === 'Monday') {
      for (let i = 0; i < this.backupMajor[0].schedule.monday.length; i++) {
        if (timeSlot == this.backupMajor[0].schedule.monday[i].timeSlot) {
          return true;
        }
      }
    }
    else if (day === 'Tuesday') {
      for (let i = 0; i < this.backupMajor[0].schedule.tuesday.length; i++) {
        if (timeSlot == this.backupMajor[0].schedule.tuesday[i].timeSlot) {
          return true;
        }
      }
    }
    else if (day === 'Wednesday') {
      for (let i = 0; i < this.backupMajor[0].schedule.wednesday.length; i++) {
        if (timeSlot == this.backupMajor[0].schedule.wednesday[i].timeSlot) {
          return true;
        }
      }
    }
    else if (day === 'Thursday') {
      for (let i = 0; i < this.backupMajor[0].schedule.thursday.length; i++) {
        if (timeSlot == this.backupMajor[0].schedule.thursday[i].timeSlot) {
          return true;
        }
      }
    }
    else if (day === 'Friday') {
      for (let i = 0; i < this.backupMajor[0].schedule.friday.length; i++) {
        if (timeSlot == this.backupMajor[0].schedule.friday[i].timeSlot) {
          return true;
        }
      }
    }
    return false;
  }

  addToSchedule(day: string, timeSlot: string, event: any) {
    const checked = event.target.checked;
    const selectedSlot = {
      day: day,
      timeSlot: timeSlot
    };
    if (checked) {
      // Checkbox is checked, add the slot to the array
      this.selectedSlots.push(JSON.stringify(selectedSlot));
      console.log('added this', JSON.stringify(selectedSlot));
    } else {
      // Checkbox is unchecked, remove the slot from the array
      const index = this.selectedSlots.findIndex(slot => JSON.parse(slot).day === day && JSON.parse(slot).timeSlot === timeSlot);
      if (index > -1) {
        this.selectedSlots.splice(index, 1);
      }
    }
  }

  showable() {
    if (this.selectedSubject === 'empty') {
      this.isSubjectSelected = false;
      this.showTimetable = false;
      this.isUserEditing = false;
      this.changeEditStatusInDB();
    } else if (this.selectedSubject && this.selectedSubject !== 'empty') {
      this.isSubjectSelected = true;
      this.showTimetable = true;
      this.isUserEditing = true;
      this.changeEditStatusInDB();
    } else {
      this.isSubjectSelected = false;
      this.showTimetable = false;
      alert('Please select a subject first.');
      this.isUserEditing = true;
      this.changeEditStatusInDB();
    }
  }


  changeEditStatusInDB() {
    this.AuthService.updateScheduleEditStatus(this.currentMajorId, this.isUserEditing).subscribe(response => {
      console.log('Updated edit status in DB');
    });
  }
  saveSlots() {
    if (this.selectedSlots.length > 0) {
      if (this.backupMajor.length > 0) {
        const selectedSlotsCopy = [...this.selectedSlots];
        for (let i = 0; i < selectedSlotsCopy.length; i++) {
          const selectedSlot = JSON.parse(selectedSlotsCopy[i]);
          const { day, timeSlot } = selectedSlot;
          let scheduleDay;

          switch (day) {
            case 'Sunday':
              scheduleDay = this.backupMajor[0].schedule.sunday;
              break;
            case 'Monday':
              scheduleDay = this.backupMajor[0].schedule.monday;
              break;
            case 'Tuesday':
              scheduleDay = this.backupMajor[0].schedule.tuesday;
              break;
            case 'Wednesday':
              scheduleDay = this.backupMajor[0].schedule.wednesday;
              break;
            case 'Thursday':
              scheduleDay = this.backupMajor[0].schedule.thursday;
              break;
            case 'Friday':
              scheduleDay = this.backupMajor[0].schedule.friday;
              break;
            default:
              console.log('Invalid day');
              break;
          }

          if (scheduleDay) {
            const isSlotExists = scheduleDay.some(slot => slot.timeSlot === timeSlot);
            if (!isSlotExists) {
              scheduleDay.push({ courseId: this.selectedSubject, timeSlot: timeSlot });
            }
          }
        }

        this.showTimetable = false;

        this.AuthService.updateSchedule(this.backupMajor[0]).subscribe(
          response => {
            console.log('Schedule updated successfully');
          },
          error => {
            console.log('Error occurred while updating schedule:', error);
          }
        );
      }
    }
    this.isUserEditing = false;
    this.changeEditStatusInDB();
    this.showTimetable = false;
  }


  updateSelectBeenMade() {
    if (this.selectedSubject === 'empty') {
      this.isSubjectSelected = false;
      this.showTimetable = false;
      this.isUserEditing = false;
    }
    this.isSubjectSelected = !!this.selectedSubject;
  }

}

