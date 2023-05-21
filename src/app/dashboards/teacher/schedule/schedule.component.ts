import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from 'src/app/services/AuthService';
import { Course, Major } from 'src/app/models/allModels';
import { User } from 'src/app/models/allModels';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { error, get } from 'jquery';
import { SharedService } from 'src/app/services/SharedService';


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  timeSlots: string[] = ['8:00-9:00AM', '9:10-10:10AM', '10:20-11:20AM', '11:30-12:30PM', '12:40-13:40PM', '13:50-14:50PM', '15:00-16:00PM', '17:10-18:10PM'];
  showTimetable: boolean = false;
  showTimetableRemove: boolean = false;
  showTimetableCustom: boolean = false;
  currentMajor: string = '';
  currentEmail: any;
  userDetails: User[] = [];
  currentMajorId: any;
  selectedSlots: any[] = [];
  selectedSlotsRemove: any[] = [];
  selectedSlotsEvents: any[] = [];
  userId: any;
  backupMajor: Major[] = [];
  backupMajorRemove: Major[] = [];
  backupMajorEvent: Major[] = [];
  teacherCourses: any;
  teacherCoursesBackup: any;
  coursesList: string[] = [];
  selectedSubject: any;
  selectedSubjectRemove: any;
  isUserEditing: boolean = false;
  isBeingEditedByOtherUser: boolean = false;
  showDetailsEvent = false;
  selectedDay: any;
  eventTitle: any;
  eventDescription: any;
  selectedTimeSlot: any;

  constructor(private AuthService: AuthService, private renderer: Renderer2, private firestore: AngularFirestore, private SharedService: SharedService) { }

  async ngOnInit(): Promise<void> {
    try {
      this.userDetails = await this.SharedService.getUserDetails(); // Assign the resolved value to teacherCourses
      this.teacherCourses = await this.SharedService.getTeacherCourses();
      this.teacherCoursesBackup = await this.SharedService.getTeacherCourses();
      console.log('adsasdas', this.teacherCourses);
      this.currentEmail = localStorage.getItem('email');
      this.AuthService.getUserDetails(this.currentEmail).subscribe(
        response => {
          this.userDetails = response;
          this.userId = response[0].id;
          if (this.userDetails.length > 0) {
            this.currentMajor = this.userDetails[0].major;
            this.AuthService.getMajorDetails(this.currentMajor).subscribe(response => {
              this.backupMajor = response;
              this.backupMajorRemove = response;
              this.backupMajorEvent = response;
              if (this.backupMajor.length > 0) {
                this.currentMajorId = this.backupMajor[0].id;
                this.isBeingEditedByOtherUser = this.backupMajor[0].isBeingEdited;
                if (this.isBeingEditedByOtherUser) {
                  alert('This major is being edited by another user. Please try again later.');
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
      for (let i = 0; i < this.teacherCourses.length; i++) {
        const a = this.teacherCourses[i].id;
        this.AuthService.getCourseDetails(a).subscribe(response => {
          const courseName = response[0].name;
          this.coursesList.push(courseName);
        });
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }
  getCourseId(day: string, timeSlot: string): string {
    let courseTitle = '';

    if (day === 'Sunday') {
      for (let i = 0; i < this.backupMajor[0].schedule.sunday.length; i++) {
        if (timeSlot === this.backupMajor[0].schedule.sunday[i].timeSlot) {
          courseTitle = this.backupMajor[0].schedule.sunday[i].title;
          break;
        }
      }
    } else if (day === 'Monday') {
      for (let i = 0; i < this.backupMajor[0].schedule.monday.length; i++) {
        if (timeSlot === this.backupMajor[0].schedule.monday[i].timeSlot) {
          courseTitle = this.backupMajor[0].schedule.monday[i].title;
          break;
        }
      }
    } else if (day === 'Tuesday') {
      for (let i = 0; i < this.backupMajor[0].schedule.tuesday.length; i++) {
        if (timeSlot === this.backupMajor[0].schedule.tuesday[i].timeSlot) {
          courseTitle = this.backupMajor[0].schedule.tuesday[i].title;
          break;
        }
      }
    } else if (day === 'Wednesday') {
      for (let i = 0; i < this.backupMajor[0].schedule.wednesday.length; i++) {
        if (timeSlot === this.backupMajor[0].schedule.wednesday[i].timeSlot) {
          courseTitle = this.backupMajor[0].schedule.wednesday[i].title;
          break;
        }
      }
    } else if (day === 'Thursday') {
      for (let i = 0; i < this.backupMajor[0].schedule.thursday.length; i++) {
        if (timeSlot === this.backupMajor[0].schedule.thursday[i].timeSlot) {
          courseTitle = this.backupMajor[0].schedule.thursday[i].title;
          break;
        }
      }
    } else if (day === 'Friday') {
      for (let i = 0; i < this.backupMajor[0].schedule.friday.length; i++) {
        if (timeSlot === this.backupMajor[0].schedule.friday[i].timeSlot) {
          courseTitle = this.backupMajor[0].schedule.friday[i].title;
          break;
        }
      }
    }

    return courseTitle;
  }
  isItUserCourse(courseId: any): boolean {
    let isUserCourse = false;
    for (let i = 0; i < this.teacherCourses.length; i++) {
      if (courseId === this.teacherCourses[i].id) {
        isUserCourse = true;
        break;
      }
    }
    return isUserCourse;
  }

  changeEditStatusInDB() {
    this.AuthService.updateScheduleEditStatus(this.currentMajorId, this.isUserEditing).subscribe(response => {
      console.log('Updated edit status in DB');
    });
  }
  /**********************************************************************Remove timetable*************************************************************************************/
  disableCheckboxForRemoveList(day: string, timeSlot: string): boolean {
    if (day === 'Sunday') {
      for (let i = 0; i < this.backupMajor[0].schedule.sunday.length; i++) {
        if (timeSlot === this.backupMajor[0].schedule.sunday[i].timeSlot && this.backupMajor[0].schedule.sunday[i].title === this.selectedSubjectRemove ||
          timeSlot === this.backupMajor[0].schedule.sunday[i].timeSlot && this.backupMajor[0].schedule.sunday[i].courseId === this.userId) {
          return false;
        }

      }
    }
    else if (day === 'Monday') {
      for (let i = 0; i < this.backupMajor[0].schedule.monday.length; i++) {
        if (timeSlot === this.backupMajor[0].schedule.monday[i].timeSlot && this.backupMajor[0].schedule.monday[i].title === this.selectedSubjectRemove ||
          timeSlot === this.backupMajor[0].schedule.monday[i].timeSlot && this.backupMajor[0].schedule.monday[i].courseId === this.userId) {
          return false;
        }
      }
    }
    else if (day === 'Tuesday') {
      for (let i = 0; i < this.backupMajor[0].schedule.tuesday.length; i++) {
        if (timeSlot === this.backupMajor[0].schedule.tuesday[i].timeSlot && this.backupMajor[0].schedule.tuesday[i].title === this.selectedSubjectRemove ||
          timeSlot === this.backupMajor[0].schedule.tuesday[i].timeSlot && this.backupMajor[0].schedule.tuesday[i].courseId === this.userId) {
          return false;
        }
      }
    }
    else if (day === 'Wednesday') {
      for (let i = 0; i < this.backupMajor[0].schedule.wednesday.length; i++) {
        if (timeSlot === this.backupMajor[0].schedule.wednesday[i].timeSlot && this.backupMajor[0].schedule.wednesday[i].title === this.selectedSubjectRemove ||
          timeSlot === this.backupMajor[0].schedule.wednesday[i].timeSlot && this.backupMajor[0].schedule.wednesday[i].courseId === this.userId) {
          return false;
        }
      }
    }
    else if (day === 'Thursday') {
      for (let i = 0; i < this.backupMajor[0].schedule.thursday.length; i++) {
        if (timeSlot === this.backupMajor[0].schedule.thursday[i].timeSlot && this.backupMajor[0].schedule.thursday[i].title === this.selectedSubjectRemove ||
          timeSlot === this.backupMajor[0].schedule.thursday[i].timeSlot && this.backupMajor[0].schedule.thursday[i].courseId === this.userId) {
          return false;
        }
      }
    }
    else if (day === 'Friday') {
      for (let i = 0; i < this.backupMajor[0].schedule.friday.length; i++) {
        if (timeSlot === this.backupMajor[0].schedule.friday[i].timeSlot && this.backupMajor[0].schedule.friday[i].title === this.selectedSubjectRemove ||
          timeSlot === this.backupMajor[0].schedule.friday[i].timeSlot && this.backupMajor[0].schedule.friday[i].courseId === this.userId) {
          return false;
        }
      }
    }
    return true;
  }
  addToScheduleRemove(day: string, timeSlot: string, event: any) {
    const checked = event.target.checked;
    let courseDetails: Course[] = [];
    let titleCurrent = '';
    let descriptionCurrent = '';

    this.AuthService.getCourseDetails(this.selectedSubject).subscribe(response => {
      courseDetails = response;

      if (courseDetails.length > 0) {
        titleCurrent = courseDetails[0].name;
        descriptionCurrent = courseDetails[0].description;
      }

      const selectedSlot = {
        day: day,
        timeSlot: timeSlot,
        courseId: this.selectedSubject,
        title: titleCurrent,
        description: descriptionCurrent
      };

      if (checked) {
        this.selectedSlotsRemove.push(selectedSlot);
        console.log('Added slot to Remove:', JSON.stringify(selectedSlot));
      } else {
        // Checkbox is unchecked, remove the slot from the array
        const index = this.selectedSlotsRemove.findIndex(slot => slot.day === day && slot.timeSlot === timeSlot);
        if (index > -1) {
          this.selectedSlotsRemove.splice(index, 1);
          console.log('Removed slot:', JSON.stringify(selectedSlot));
        }
      }
    }, error => {
      console.log('Error occurred while fetching course details:', error);
    });
  }
  saveSlotsRemove() {
    if (this.selectedSlotsRemove.length > 0 && this.backupMajorRemove.length > 0) {

      for (let i = 0; i < this.selectedSlotsRemove.length; i++) {
        if (this.selectedSlotsRemove[i].day === 'Sunday') {
          for (let j = 0; j < this.backupMajorRemove[0].schedule.sunday.length; j++) {
            if (this.selectedSlotsRemove[i].timeSlot === this.backupMajorRemove[0].schedule.sunday[j].timeSlot) {
              this.backupMajorRemove[0].schedule.sunday.splice(j, 1);
            }
          }
        }
        else if (this.selectedSlotsRemove[i].day === 'Monday') {
          for (let j = 0; j < this.backupMajorRemove[0].schedule.monday.length; j++) {
            if (this.selectedSlotsRemove[i].timeSlot === this.backupMajorRemove[0].schedule.monday[j].timeSlot) {
              this.backupMajorRemove[0].schedule.monday.splice(j, 1);
            }
          }
        }
        else if (this.selectedSlotsRemove[i].day === 'Tuesday') {
          for (let j = 0; j < this.backupMajorRemove[0].schedule.tuesday.length; j++) {
            if (this.selectedSlotsRemove[i].timeSlot === this.backupMajorRemove[0].schedule.tuesday[j].timeSlot) {
              this.backupMajorRemove[0].schedule.tuesday.splice(j, 1);
            }
          }
        }
        else if (this.selectedSlotsRemove[i].day === 'Wednesday') {
          for (let j = 0; j < this.backupMajorRemove[0].schedule.wednesday.length; j++) {
            if (this.selectedSlotsRemove[i].timeSlot === this.backupMajorRemove[0].schedule.wednesday[j].timeSlot) {
              this.backupMajorRemove[0].schedule.wednesday.splice(j, 1);
            }
          }
        }
        else if (this.selectedSlotsRemove[i].day === 'Thursday') {
          for (let j = 0; j < this.backupMajorRemove[0].schedule.thursday.length; j++) {
            if (this.selectedSlotsRemove[i].timeSlot === this.backupMajorRemove[0].schedule.thursday[j].timeSlot) {
              this.backupMajorRemove[0].schedule.thursday.splice(j, 1);
            }
          }
        }
        else if (this.selectedSlotsRemove[i].day === 'Friday') {
          for (let j = 0; j < this.backupMajorRemove[0].schedule.friday.length; j++) {
            if (this.selectedSlotsRemove[i].timeSlot === this.backupMajorRemove[0].schedule.friday[j].timeSlot) {
              this.backupMajorRemove[0].schedule.friday.splice(j, 1);
            }
          }
        }

      }
      this.showTimetableRemove = false;
      this.AuthService.updateSchedule(this.backupMajorRemove[0]).subscribe(
        response => {
          console.log('Schedule updated successfully');
        },
        error => {
          console.log('Error occurred while updating schedule:', error);
        }
      );
    }

    this.isUserEditing = false;
    this.changeEditStatusInDB();
    this.showTimetableRemove = false;
  }
  updateSelectBeenMadeRemove() {
    this.selectedSubjectRemove != this.selectedSubjectRemove;
    this.showTimetableRemove = false;
  }
  showableRemove() {
    if (this.selectedSubjectRemove === false) {
      this.showTimetableRemove = false;
      alert('Please select a subject first.');
    }
    else if (this.selectedSubjectRemove === 'empty') {
      this.showTimetableRemove = false;
      alert('Please select a subject first.');
    }
    else if (this.selectedSubjectRemove.length < 0) {
      this.showTimetableRemove = false;
      alert('Please select a subject first.');
    }
    else {
      this.showTimetableRemove = true;
    }
  }
  /******************************************************************** Add timetable ***********************************************************************************/
  updateSelectBeenMade() {
    this.selectedSubject != this.selectedSubject;
    this.showTimetable = false;
  }
  showable() {
    if (this.selectedSubject === false) {
      this.showTimetable = false;
      this.isUserEditing = false;
      this.changeEditStatusInDB();
      alert('Please select a subject first.');
    }
    else if (this.selectedSubject === 'empty') {
      this.showTimetable = false;
      this.isUserEditing = false;
      this.changeEditStatusInDB();
      alert('Please select a subject first.');
    }
    else if (this.selectedSubject.length < 0) {
      this.showTimetable = false;
      this.isUserEditing = false;
      this.changeEditStatusInDB();
      alert('Please select a subject first.');
    }
    else {
      this.showTimetable = true;
      this.isUserEditing = true;
      this.changeEditStatusInDB();
    }
  }
  addToSchedule(day: string, timeSlot: string, event: any) {
    const checked = event.target.checked;
    let titleCurrent = '';
    let descriptionCurrent = '';
    let idCurrent = '';

    for (let i = 0; i < this.teacherCoursesBackup.length; i++) {
      if (this.teacherCoursesBackup[i].name == this.selectedSubject) {
        titleCurrent = this.teacherCoursesBackup[i].title;
        descriptionCurrent = this.teacherCoursesBackup[i].description;
        idCurrent = this.teacherCoursesBackup[i].id;
      }
    }

    const selectedSlot = {
      day: day,
      timeSlot: timeSlot,
      courseId: idCurrent,
      title: this.selectedSubject,
      description: descriptionCurrent
    };

    if (checked) {
      this.selectedSlots.push(selectedSlot);
      console.log('Added slot:', JSON.stringify(selectedSlot));
    } else {
      const index = this.selectedSlots.findIndex(
        slot => slot.day === day && slot.timeSlot === timeSlot
      );
      if (index > -1) {
        this.selectedSlots.splice(index, 1);
        console.log('Removed slot:', JSON.stringify(selectedSlot));
      }
    }
  }
  saveSlots() {
    if (this.selectedSlots.length > 0 && this.backupMajor.length > 0) {
      const backupMajor = this.backupMajor[0];

      for (let i = 0; i < this.selectedSlots.length; i++) {
        const selectedSlot = this.selectedSlots[i];
        const { day, timeSlot, courseId, title, description } = selectedSlot;
        let scheduleDay;

        switch (day) {
          case 'Sunday':
            scheduleDay = backupMajor.schedule.sunday;
            break;
          case 'Monday':
            scheduleDay = backupMajor.schedule.monday;
            break;
          case 'Tuesday':
            scheduleDay = backupMajor.schedule.tuesday;
            break;
          case 'Wednesday':
            scheduleDay = backupMajor.schedule.wednesday;
            break;
          case 'Thursday':
            scheduleDay = backupMajor.schedule.thursday;
            break;
          case 'Friday':
            scheduleDay = backupMajor.schedule.friday;
            break;
          default:
            console.log('Invalid day');
            break;
        }

        if (scheduleDay) {
          const isSlotExists = scheduleDay.some(slot => slot.timeSlot === timeSlot);
          if (!isSlotExists) {
            scheduleDay.push({ courseId: courseId, timeSlot: timeSlot, title: title, description: description });
          }
        }
      }

      this.showTimetable = false;

      console.log('backupMajor:', backupMajor);
      this.AuthService.updateSchedule(backupMajor).subscribe(
        response => {
          console.log('Schedule updated successfully');
        },
        error => {
          console.log('Error occurred while updating schedule:', error);
        }
      );
    }

    this.isUserEditing = false;
    this.changeEditStatusInDB();
    this.showTimetable = false;
  }
  disableCheckboxForAddList(day: string, timeSlot: string): boolean {
    if (day === 'Sunday') {
      for (let i = 0; i < this.backupMajor[0].schedule.sunday.length; i++) {
        if (timeSlot === this.backupMajor[0].schedule.sunday[i].timeSlot) {
          if (this.backupMajor[0].schedule.sunday[i].title === this.selectedSubject || this.backupMajor[0].schedule.sunday[i].title.length > 0) {
            return true;
          }
        }
      }
    }
    else if (day === 'Monday') {
      for (let i = 0; i < this.backupMajor[0].schedule.monday.length; i++) {
        if (timeSlot === this.backupMajor[0].schedule.monday[i].timeSlot) {
          if (this.backupMajor[0].schedule.monday[i].title === this.selectedSubject || this.backupMajor[0].schedule.monday[i].title.length > 0) {
            return true;
          }
        }
      }
    }
    else if (day === 'Tuesday') {
      for (let i = 0; i < this.backupMajor[0].schedule.tuesday.length; i++) {
        if (timeSlot === this.backupMajor[0].schedule.tuesday[i].timeSlot) {
          if (this.backupMajor[0].schedule.tuesday[i].title === this.selectedSubject || this.backupMajor[0].schedule.tuesday[i].title.length > 0) {
            return true;
          }
        }
      }
    }
    else if (day === 'Wednesday') {
      for (let i = 0; i < this.backupMajor[0].schedule.wednesday.length; i++) {
        if (timeSlot === this.backupMajor[0].schedule.wednesday[i].timeSlot) {
          if (this.backupMajor[0].schedule.wednesday[i].title === this.selectedSubject || this.backupMajor[0].schedule.wednesday[i].title.length > 0) {
            return true;
          }
        }
      }
    }
    else if (day === 'Thursday') {
      for (let i = 0; i < this.backupMajor[0].schedule.thursday.length; i++) {
        if (timeSlot === this.backupMajor[0].schedule.thursday[i].timeSlot) {
          if (this.backupMajor[0].schedule.thursday[i].title === this.selectedSubject || this.backupMajor[0].schedule.thursday[i].title.length > 0) {
            return true;
          }
        }
      }
    }
    else if (day === 'Friday') {
      for (let i = 0; i < this.backupMajor[0].schedule.friday.length; i++) {
        if (timeSlot === this.backupMajor[0].schedule.friday[i].timeSlot) {
          if (this.backupMajor[0].schedule.friday[i].title === this.selectedSubject || this.backupMajor[0].schedule.friday[i].title.length > 0) {
            return true;
          }
        }
      }
    }

    return false;
  }
  /********************************************************************Custom event*******************************************************************************************/
  showableCustom() {
    if (this.showTimetableCustom === false) {
      this.showTimetableCustom = true;
      this.isUserEditing = true;
      this.changeEditStatusInDB();
    }
    else {
      this.showTimetableCustom = false;
      this.isUserEditing = false;
      this.changeEditStatusInDB();
    }
  }
  disableCheckboxForCustom(day: string, timeSlot: string): boolean {
    if (day === 'Sunday') {
      for (let i = 0; i < this.backupMajor[0].schedule.sunday.length; i++) {
        if (this.backupMajor[0].schedule.sunday[i].timeSlot === timeSlot) {
          this.showDetailsEvent = false;
          return true;
        }
      }
    }
    else if (day === 'Monday') {
      for (let i = 0; i < this.backupMajor[0].schedule.monday.length; i++) {
        if (this.backupMajor[0].schedule.monday[i].timeSlot === timeSlot) {
          this.showDetailsEvent = false;
          return true;
        }
      }
    }
    else if (day === 'Tuesday') {
      for (let i = 0; i < this.backupMajor[0].schedule.tuesday.length; i++) {
        if (this.backupMajor[0].schedule.tuesday[i].timeSlot === timeSlot) {
          this.showDetailsEvent = false;
          return true;
        }
      }
    }
    else if (day === 'Wednesday') {
      for (let i = 0; i < this.backupMajor[0].schedule.wednesday.length; i++) {
        if (this.backupMajor[0].schedule.wednesday[i].timeSlot === timeSlot) {
          this.showDetailsEvent = false;
          return true;
        }
      }
    }
    else if (day === 'Thursday') {
      for (let i = 0; i < this.backupMajor[0].schedule.thursday.length; i++) {
        if (this.backupMajor[0].schedule.thursday[i].timeSlot === timeSlot) {
          this.showDetailsEvent = false;
          return true;
        }
      }
    }
    else if (day === 'Friday') {
      for (let i = 0; i < this.backupMajor[0].schedule.friday.length; i++) {
        if (this.backupMajor[0].schedule.friday[i].timeSlot === timeSlot) {
          this.showDetailsEvent = false;
          return true;
        }
      }
    }
    this.showDetailsEvent = true;
    return false;
  }
  addToScheduleEvent(day: string, timeSlot: string, event: any) {
    const checked = event.target.checked;
    const selectedSlot = {
      day: day,
      timeSlot: timeSlot,
      courseId: this.selectedSubject
    };

    if (checked) {

      this.selectedSlotsEvents.push(JSON.stringify(selectedSlot));
      console.log('Added slot to (BE ADDED event)):', JSON.stringify(selectedSlot));
      const form = document.getElementById("form") as HTMLElement;
      const formContent = form.innerHTML;
      const popupWindow = window.open("", "_blank", "width=400,height=400");
      popupWindow?.document.write(formContent);

    } else {
      // Checkbox is unchecked, remove the slot from the array
      const index = this.selectedSlotsEvents.findIndex(slot => JSON.parse(slot).day === day && JSON.parse(slot).timeSlot === timeSlot);
      if (index > -1) {
        this.selectedSlotsEvents.splice(index, 1);
        console.log('Removed slot (event):', JSON.stringify(selectedSlot));
      }
    }
  }



  submitForm(selectedDay: string, selectedTimeSlot: string, eventTitle: string, eventDescription: string) {
    const backupMajor = this.backupMajorEvent[0];

    let scheduleDay;
    switch (selectedDay) {
      case 'Sunday':
        scheduleDay = backupMajor.schedule.sunday;
        break;
      case 'Monday':
        scheduleDay = backupMajor.schedule.monday;
        break;
      case 'Tuesday':
        scheduleDay = backupMajor.schedule.tuesday;
        break;
      case 'Wednesday':
        scheduleDay = backupMajor.schedule.wednesday;
        break;
      case 'Thursday':
        scheduleDay = backupMajor.schedule.thursday;
        break;
      case 'Friday':
        scheduleDay = backupMajor.schedule.friday;
        break;
      default:
        console.log('Invalid day');
        break;
    }

    if (scheduleDay) {
      const isSlotExists = scheduleDay.some(slot => slot.timeSlot === selectedTimeSlot);
      if (!isSlotExists) {
        scheduleDay.push({
          courseId: this.userId,
          timeSlot: selectedTimeSlot,
          title: this.eventTitle,
          description: this.eventDescription
        });
      }
    }

    this.showTimetable = false;

    console.log('backupMajor:', backupMajor);
    this.AuthService.updateSchedule(backupMajor).subscribe(
      response => {
        console.log('Event added, Schedule updated successfully');
      },
      error => {
        console.log('Error occurred while updating schedule:', error);
      }
    );
  }
  customEventChangeStatus() {
    this.isUserEditing = true;
    this.showTimetable = false;
    this.showTimetableRemove = false;
    this.changeEditStatusInDB();
  }
  isDaySelected(): boolean {
    if (this.selectedDay === 'Sunday' || this.selectedDay === 'Monday' || this.selectedDay === 'Tuesday' || this.selectedDay === 'Wednesday' || this.selectedDay === 'Thursday' || this.selectedDay === 'Friday') {
      return false;
    }
    {

    }
    return true;
  }

}