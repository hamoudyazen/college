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
  rooms: string[] = ['A-001', 'A-002', 'A-003', 'A-004', 'A-005', 'A-006', 'A-007', 'A-008', 'A-009', 'A-010', 'A-011', 'A-012', 'A-013', 'A-014', 'A-015', 'A-016', 'A-017', 'A-018', 'A-019', 'A-020', 'A-021', 'A-022', 'A-023', 'A-024', 'A-025', 'A-026', 'A-027', 'A-028', 'A-029', 'A-030', 'A-031', 'A-032', 'A-033', 'A-034', 'A-035', 'A-036', 'A-037', 'A-038', 'A-039', 'A-040', 'A-041', 'A-042', 'A-043', 'A-044', 'A-045', 'A-046', 'A-047', 'A-048', 'A-049', 'A-050', 'A-051', 'A-052', 'A-053', 'A-054', 'A-055', 'A-056', 'A-057', 'A-058', 'A-059', 'A-060', 'A-061', 'A-062', 'A-063', 'A-064', 'A-065', 'A-066', 'A-067', 'A-068', 'A-069', 'A-070', 'A-071', 'A-072', 'A-073', 'A-074', 'A-075', 'A-076', 'A-077', 'A-078', 'A-079', 'A-080', 'A-081', 'A-082', 'A-083', 'A-084', 'A-085', 'A-086', 'A-087', 'A-088', 'A-089', 'A-090', 'A-091', 'A-092', 'A-093', 'A-094', 'A-095', 'A-096', 'A-097', 'A-098', 'A-099', 'A-100'];

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
  showDetailsEvent = false;
  selectedDay: any;
  eventTitle: any;
  eventDescription: any;
  selectedTimeSlot: any;

  courseHours!: number;
  selectedSubjectAutoFill: any;
  allCourses: any;

  totalCourseHours = 0;
  totalCourseHoursLeft = 0;
  constructor(private AuthService: AuthService, private renderer: Renderer2, private firestore: AngularFirestore, private SharedService: SharedService) { }

  async ngOnInit(): Promise<void> {
    try {

      this.userDetails = await this.SharedService.getUserDetails(); // Assign the resolved value to teacherCourses
      this.teacherCourses = await this.SharedService.getTeacherCourses();
      this.teacherCoursesBackup = await this.SharedService.getTeacherCourses();
      this.allCourses = await this.SharedService.getAllCourseTeachers();

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
    this.totalCourseHoursLeft = 0;
    for (let i = 0; i < this.allCourses.length; i++) {
      if (this.selectedSubject == this.allCourses[i].name) {
        this.totalCourseHours = this.allCourses[i].semesterHours;
        console.log('Total course hours:', this.totalCourseHours);
      }
    }
    for (let i = 0; i < this.backupMajor[0].schedule.sunday.length; i++) {
      if (this.backupMajor[0].schedule.sunday[i].title === this.selectedSubject) {
        this.totalCourseHoursLeft++;
      }
    }
    for (let i = 0; i < this.backupMajor[0].schedule.monday.length; i++) {
      if (this.backupMajor[0].schedule.monday[i].title === this.selectedSubject) {
        this.totalCourseHoursLeft++;
      }
    }
    for (let i = 0; i < this.backupMajor[0].schedule.tuesday.length; i++) {
      if (this.backupMajor[0].schedule.tuesday[i].title === this.selectedSubject) {
        this.totalCourseHoursLeft++;
      }
    }
    for (let i = 0; i < this.backupMajor[0].schedule.wednesday.length; i++) {
      if (this.backupMajor[0].schedule.wednesday[i].title === this.selectedSubject) {
        this.totalCourseHoursLeft++;
      }
    }
    for (let i = 0; i < this.backupMajor[0].schedule.thursday.length; i++) {
      if (this.backupMajor[0].schedule.thursday[i].title === this.selectedSubject) {
        this.totalCourseHoursLeft++;
      }
    }
    for (let i = 0; i < this.backupMajor[0].schedule.friday.length; i++) {
      if (this.backupMajor[0].schedule.friday[i].title === this.selectedSubject) {
        this.totalCourseHoursLeft++;
      }


      this.totalCourseHoursLeft = this.totalCourseHoursLeft + this.selectedSlots.length;
      console.log('Total course hours left:', this.totalCourseHoursLeft);
    }



    if (this.selectedSubject === false) {
      this.showTimetable = false;
      alert('Please select a subject first.');
    }
    else if (this.selectedSubject === 'empty') {
      this.showTimetable = false;
      alert('Please select a subject first.');
    }
    else if (this.selectedSubject.length < 0) {
      this.showTimetable = false;
      alert('Please select a subject first.');
    }
    else {
      this.showTimetable = true;
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
      this.totalCourseHoursLeft++;
      this.selectedSlots.push(selectedSlot);
      console.log('Added slot:', JSON.stringify(selectedSlot));
    } else {
      const index = this.selectedSlots.findIndex(
        slot => slot.day === day && slot.timeSlot === timeSlot
      );
      if (index > -1) {
        this.totalCourseHoursLeft--;
        console.log('total left: ', this.totalCourseHoursLeft);
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
        const { day, timeSlot, courseId, title, description, room } = selectedSlot;
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
            let roomAvailable = '';

            for (let j = 0; j < this.rooms.length; j++) {
              const roomExists = scheduleDay.some(slot => slot.room === this.rooms[j]);
              if (!roomExists) {
                roomAvailable = this.rooms[j];
                break;
              }
            }

            if (roomAvailable) {
              scheduleDay.push({ courseId: courseId, timeSlot: timeSlot, title: title, description: description, room: roomAvailable });
            }
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

    this.showTimetable = false;
    window.location.reload();
  }

  myIncludes(day: string, timeSlot: string): boolean {
    for (let i = 0; i < this.selectedSlots.length; i++) {
      if (this.selectedSlots[i].day === day && this.selectedSlots[i].timeSlot === timeSlot) {
        return true;
      }
    }
    return false;
  }

  disableCheckboxForAddList(day: string, timeSlot: string): boolean {

    const foundCourse = this.allCourses.find((course: { name: string; }) => course.name === this.selectedSubject);
    if (foundCourse) {
      this.courseHours = foundCourse.semesterHours;
    }


    for (let i = 0; i < this.selectedSlots.length; i++) {
      if (this.totalCourseHoursLeft >= this.totalCourseHours) {
        let check = this.myIncludes(day, timeSlot);
        if (check === false)
          return true;
      }
    }


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

  hasHoursAddTable(subject: string) {
    let takenHours = 0;

    for (let i = 0; i < this.allCourses.length; i++) {
      if (this.allCourses[i].name === subject) {
        this.courseHours = this.allCourses[i].semesterHours;
      }
    }

    if (!this.backupMajor || !this.backupMajor[0] || !this.backupMajor[0].schedule) {
      return false;
    }

    if (this.backupMajor[0].schedule.sunday) {
      for (let i = 0; i < this.backupMajor[0].schedule.sunday.length; i++) {
        if (this.backupMajor[0].schedule.sunday[i].title === subject) {
          takenHours++;
        }
      }
    }

    if (this.backupMajor[0].schedule.monday) {
      for (let i = 0; i < this.backupMajor[0].schedule.monday.length; i++) {
        if (this.backupMajor[0].schedule.monday[i].title === subject) {
          takenHours++;
        }
      }
    }

    if (this.backupMajor[0].schedule.tuesday) {
      for (let i = 0; i < this.backupMajor[0].schedule.tuesday.length; i++) {
        if (this.backupMajor[0].schedule.tuesday[i].title === subject) {
          takenHours++;
        }
      }
    }

    if (this.backupMajor[0].schedule.wednesday) {
      for (let i = 0; i < this.backupMajor[0].schedule.wednesday.length; i++) {
        if (this.backupMajor[0].schedule.wednesday[i].title === subject) {
          takenHours++;
        }
      }
    }

    if (this.backupMajor[0].schedule.thursday) {
      for (let i = 0; i < this.backupMajor[0].schedule.thursday.length; i++) {
        if (this.backupMajor[0].schedule.thursday[i].title === subject) {
          takenHours++;
        }
      }
    }

    if (this.backupMajor[0].schedule.friday) {
      for (let i = 0; i < this.backupMajor[0].schedule.friday.length; i++) {
        if (this.backupMajor[0].schedule.friday[i].title === subject) {
          takenHours++;
        }
      }
    }

    if (takenHours >= this.courseHours) {
      return true;
    } else {
      return false;
    }
  }


  /*************************************************************************** AutoFill **********************************************************************************************/
  autoComplete(selectedSubjectAutoFill: string) {
    const tempTimeSlots: any[] = ['8:00-9:00AM', '9:10-10:10AM', '10:20-11:20AM', '11:30-12:30PM', '12:40-13:40PM', '13:50-14:50PM', '15:00-16:00PM', '17:10-18:10PM'];

    for (let i = 0; i < this.allCourses.length; i++) {
      if (this.allCourses[i].name === selectedSubjectAutoFill) {
        this.totalCourseHours = this.allCourses[i].semesterHours;
        const courseToAdd = {
          courseId: this.allCourses[i].id,
          description: 'autofill course',
          timeSlot: '',
          title: selectedSubjectAutoFill,
          room: '',
        };

        let roomAvailable;

        const backupDaysArr = [
          this.backupMajor[0].schedule.sunday,
          this.backupMajor[0].schedule.monday,
          this.backupMajor[0].schedule.tuesday,
          this.backupMajor[0].schedule.wednesday,
          this.backupMajor[0].schedule.thursday,
          this.backupMajor[0].schedule.friday
        ];

        let totalCourseHoursLeft = 0;
        for (let j = 0; j < backupDaysArr.length; j++) {
          const dayCourses = backupDaysArr[j];
          for (let k = 0; k < dayCourses.length; k++) {
            if (dayCourses[k].title === selectedSubjectAutoFill) {
              totalCourseHoursLeft++;
            }
          }
        }
        console.log('Total course hours left:', totalCourseHoursLeft);

        for (let j = 0; j < backupDaysArr.length; j++) {
          const dayCourses = backupDaysArr[j];
          while (totalCourseHoursLeft < this.totalCourseHours) {
            let takenSlots = dayCourses.map(course => course.timeSlot);

            let availableTimeSlot = '';
            for (let k = 0; k < tempTimeSlots.length; k++) {
              if (!takenSlots.includes(tempTimeSlots[k])) {
                availableTimeSlot = tempTimeSlots[k];
                break;
              }
            }

            if (availableTimeSlot) {
              roomAvailable = undefined;
              for (let k = 0; k < this.rooms.length; k++) {
                const roomExists = dayCourses.some(slot => slot.room === this.rooms[k]);
                if (!roomExists) {
                  roomAvailable = this.rooms[k];
                  break;
                }
              }

              if (roomAvailable) {
                courseToAdd.timeSlot = availableTimeSlot;
                courseToAdd.room = roomAvailable;
                dayCourses.push({ ...courseToAdd });
                totalCourseHoursLeft++;
              } else {
                console.log('No available room on', ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][j]);
                break;
              }
            } else {
              console.log('No available time slots on', ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][j]);
              break;
            }
          }
        }
        break;
      }
    }

    this.AuthService.updateSchedule(this.backupMajor[0]).subscribe(
      response => {
        console.log('Schedule updated successfully');
        this.AuthService.getMajorDetails(this.currentMajor).subscribe(response => {
          this.backupMajor = response;
        });
      },
      error => {
        console.log('Error occurred while updating schedule:', error);
      }
    );
  }


  /********************************************************************Custom event*******************************************************************************************/
  showableCustom() {
    if (this.showTimetableCustom === false) {
      this.showTimetableCustom = true;
    }
    else {
      this.showTimetableCustom = false;
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


    let availableRoom;
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.backupMajor[0].schedule.sunday.some(course => course.room === this.rooms[i])) {
        availableRoom = this.rooms[i];
        break;
      }
    }

    if (availableRoom !== undefined) {
      if (scheduleDay) {
        const isSlotExists = scheduleDay.some(slot => slot.timeSlot === selectedTimeSlot);
        if (!isSlotExists) {
          scheduleDay.push({
            courseId: this.userId,
            timeSlot: selectedTimeSlot,
            title: this.eventTitle,
            description: this.eventDescription,
            room: availableRoom,
          });
        }
      }
    }
    else {
      console.log('No available room');
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

    this.showTimetable = false;
    this.showTimetableRemove = false;

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