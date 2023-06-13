import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from 'src/app/services/AuthService';
import { Course, CourseInsideMajor, Major } from 'src/app/models/allModels';
import { User } from 'src/app/models/allModels';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { error, get } from 'jquery';
import { SharedService } from 'src/app/services/SharedService';
import { max, timeout } from 'd3';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  timeSlots: string[] = ['8:00-9:00AM', '9:10-10:10AM', '10:20-11:20AM', '11:30-12:30PM', '12:40-13:40PM', '13:50-14:50PM', '15:00-16:00PM', '17:10-18:10PM'];
  rooms: string[] = ['A-001', 'A-002', 'A-003', 'A-004', 'A-005', 'A-006', 'A-007', 'A-008', 'A-009', 'A-010', 'A-011', 'A-012', 'A-013', 'A-014', 'A-015', 'A-016', 'A-017', 'A-018', 'A-019', 'A-020', 'A-021', 'A-022', 'A-023', 'A-024', 'A-025', 'A-026', 'A-027', 'A-028', 'A-029', 'A-030', 'A-031', 'A-032', 'A-033', 'A-034', 'A-035', 'A-036', 'A-037', 'A-038', 'A-039', 'A-040', 'A-041', 'A-042', 'A-043', 'A-044', 'A-045', 'A-046', 'A-047', 'A-048', 'A-049', 'A-050', 'A-051', 'A-052', 'A-053', 'A-054', 'A-055', 'A-056', 'A-057', 'A-058', 'A-059', 'A-060', 'A-061', 'A-062', 'A-063', 'A-064', 'A-065', 'A-066', 'A-067', 'A-068', 'A-069', 'A-070', 'A-071', 'A-072', 'A-073', 'A-074', 'A-075', 'A-076', 'A-077', 'A-078', 'A-079', 'A-080', 'A-081', 'A-082', 'A-083', 'A-084', 'A-085', 'A-086', 'A-087', 'A-088', 'A-089', 'A-090', 'A-091', 'A-092', 'A-093', 'A-094', 'A-095', 'A-096', 'A-097', 'A-098', 'A-099', 'A-100'];


  currentMajor?: Major;
  currentMajorBackUp?: Major;

  allMajors: Major[] = [];
  allCourses: Course[] = [];
  allCoursesRemove: Course[] = [];

  allCoursesBackup1: Course[] = [];
  selectedCourse: string = "";
  userDetails: User[] = [];
  dataLoaded: boolean = false;

  selectedDay: string = '';
  selectedTimeSlot: string = '';
  constructor(private AuthService: AuthService, private renderer: Renderer2, private firestore: AngularFirestore, private SharedService: SharedService) { }


  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      this.userDetails = await this.SharedService.getUserDetails(); // Assign the resolved value to teacherCourses
      this.allCourses = await this.SharedService.getAllCoursesAdmin();
      this.allCoursesRemove = await this.SharedService.getAllCoursesAdmin();

      this.allMajors = await this.SharedService.getAllMajorsAdmin();
      //to get the current major
      this.currentMajor = this.allMajors.find(major => major.majorName === this.userDetails[0].major);
      this.currentMajorBackUp = this.allMajors.find(major => major.majorName === this.userDetails[0].major);

      //end
      this.removeCourseForTeacher();
      this.dataLoaded = true;
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }

  //remove the course that the current teacher doesn't teach and  it has no hours left(DONE)
  removeCourseForTeacher() {
    const teacherID = this.userDetails[0].id;
    const newCoursesArr = this.allCourses.filter(course => course.teacherID === teacherID);
    this.allCourses = newCoursesArr;
    console.log('all courses:', this.allCourses);

    for (let i = this.allCourses.length - 1; i >= 0; i--) {
      const flag: boolean = this.availableCourses(this.allCourses[i].name);
      if (flag === true) {
        console.log('deleting', this.allCourses[i].name);
        this.allCourses.splice(i, 1);
      }
    }
  }



  //to update the currentMajor in the db (DONE)
  async updateScheduleInDatabase(): Promise<void> {
    try {
      this.AuthService.updateSchedule(this.currentMajor!).toPromise();
      location.reload();
    } catch (error) {
      location.reload();
    }
  }

  //To disable the second select options if it's taken (DONE)
  disableOption(day: string, timeSlot: string) {
    const schedule = (this.currentMajor?.schedule as any)[day.toLowerCase()];
    if (schedule) {
      //find if the timeslot is already taken , if yes disable the select option
      const course = schedule.find((item: CourseInsideMajor) => item.timeSlot === timeSlot);
      if (course) {
        return true;
      }
    }
    return false;
  }

  //to update the original schedule + assign an empty room that isn't being used by anyone (including other majors) on that specefic day (DONE)
  async submitForm(selectedDay: string, selectedTimeSlot: string, selectedCourse: string) {
    const availableRooms = this.rooms.filter(room => {
      const schedule = (this.currentMajor?.schedule as any)[selectedDay.toLowerCase()];
      if (schedule) {
        const course = schedule.find((item: CourseInsideMajor) => item.timeSlot === selectedTimeSlot && item.room === room);
        return !course;
      }
      return true;
    });

    //get a random room from the availble rooms
    if (availableRooms.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableRooms.length);
      const randomRoom = availableRooms[randomIndex];

      const matchingCourse = this.allCourses.find(course => course.name === selectedCourse);
      const courseId = matchingCourse ? matchingCourse.id : '';

      //created the new index to be added to currentMajor[day][index/timeslot]
      const newCourse: CourseInsideMajor = {
        courseId: courseId,
        timeSlot: selectedTimeSlot,
        title: selectedCourse,
        description: '',
        room: randomRoom,
      };

      if ((this.currentMajor?.schedule as any)[selectedDay.toLowerCase()]) {
        //push in the new course to the major
        ((this.currentMajor?.schedule as any)[selectedDay.toLowerCase()] as CourseInsideMajor[]).push(newCourse);
        console.log('added');

        // Save the changes to the database
        await this.updateScheduleInDatabase();

        // Clear the form inputs
        this.selectedCourse = "";
        this.selectedDay = "";
        this.selectedTimeSlot = "";
      }
    } else {
      console.log('No available rooms for the selected day and time slot.');
    }
  }

  //Delete table START

  // to show which courses to delete on second selection .(DONE)
  getScheduleCourses(day: string): CourseInsideMajor[] {
    //for easier access and shorter we use the type any and [] to find the day
    const schedule = (this.currentMajorBackUp?.schedule as any)[day.toLowerCase()];
    if (schedule) {
      //return an array that has all the courses that can be remove and the teacher teaches
      return schedule.filter((course: CourseInsideMajor) => {
        //we used allCoursesRemove because we performed deleting courses that has no hours left to be added  on the original allCourses 
        const matchingCourse = this.allCoursesRemove.find(c => c.id === course.courseId);
        return matchingCourse && matchingCourse.teacherID === this.userDetails[0].id;
      });
    }//inintalized the array as empty at the begnning
    return [];
  }


  //to remove a course from the original currentMajor
  removeCourseFromSchedule(selectedDay: string, selectedTimeSlot: string) {
    //for easier access and shorter we use the type any and [] to find the day
    const schedule = (this.currentMajor?.schedule as any)[selectedDay.toLowerCase()];
    if (schedule) {
      //find at which index in the current major [day][?] is the timeSlot
      const index = schedule.findIndex((item: CourseInsideMajor) => item.timeSlot === selectedTimeSlot);
      //remove it and delete the values in the selected stuff and update in the databse
      if (index !== -1) {
        schedule.splice(index, 1);
        this.updateScheduleInDatabase();
        this.selectedDay = '';
        this.selectedTimeSlot = '';
      }
    }
  }
  //Delete table END



  //to check how many hours that the course already have , delete the course from being selected if it's reached it's limit on hours
  availableCourses(courseName: string): boolean {
    const days: ('sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday')[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    let all: CourseInsideMajor[] = [];

    //get the count of how many hours has been taken by this course
    days.forEach((day) => {
      const slots = (this.currentMajor?.schedule as any)[day];
      if (slots) {
        const matchingSlots = slots.filter((slot: CourseInsideMajor) => slot.title === courseName);
        all = all.concat(matchingSlots);
      }
    });

    let hours = 0;
    //check how many hours does the course have.
    this.allCourses.forEach((course) => {
      if (course.name === courseName) {
        hours = course.semesterHours;
      }
    })
    if (hours > all.length) {
      return false;
    }
    return true;
  }



  //this.currentMajor refers to a property that holds information about the current major.
  //The ?. operator is known as the optional chaining operator. It allows accessing properties of an object that may be null or undefined without causing an error.
  //schedule is a variable that will hold the value of a specific day's schedule.
  //(this.currentMajor?.schedule as any) accesses the schedule property of this.currentMajor object, treating it as type any to avoid type checking.
  //[day] is using the square bracket notation to dynamically access a property of the schedule object. The value of day is used as the property name.

  Autofill() {
    while (!this.availableCourses(this.selectedCourse)) {
      const days: ('sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday')[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
      const timeSlots: string[] = ['8:00-9:00AM', '9:10-10:10AM', '10:20-11:20AM', '11:30-12:30PM', '12:40-13:40PM', '13:50-14:50PM', '15:00-16:00PM', '17:10-18:10PM'];
      const availableTimeSlots: string[] = [];

      days.forEach(day => {
        const schedule = (this.currentMajor?.schedule as any)?.[day];
        if (schedule) {
          timeSlots.forEach(timeSlot => {
            //The some function is used to check if a slot with the same timeSlot value exists in the schedule.
            const slotExists = schedule.some((slot: CourseInsideMajor) => slot.timeSlot === timeSlot);
            if (!slotExists) {
              availableTimeSlots.push(`${day} - ${timeSlot}`);
            }
          });
        }
      });

      //break down all the emptty slots in each day
      const sundayTimeSlots = availableTimeSlots.filter(slot => slot.startsWith("sunday"));
      const mondayTimeSlots = availableTimeSlots.filter(slot => slot.startsWith("monday"));
      const tuesdayTimeSlots = availableTimeSlots.filter(slot => slot.startsWith("tuesday"));
      const wednesdayTimeSlots = availableTimeSlots.filter(slot => slot.startsWith("wednesday"));
      const thursdayTimeSlots = availableTimeSlots.filter(slot => slot.startsWith("thursday"));
      const fridayTimeSlots = availableTimeSlots.filter(slot => slot.startsWith("friday"));


      const timeSlotsV2 = [
        { day: 'sunday', slots: sundayTimeSlots },
        { day: 'monday', slots: mondayTimeSlots },
        { day: 'tuesday', slots: tuesdayTimeSlots },
        { day: 'wednesday', slots: wednesdayTimeSlots },
        { day: 'thursday', slots: thursdayTimeSlots },
        { day: 'friday', slots: fridayTimeSlots }
      ];

      let maxSlots = timeSlotsV2[0].slots.length; // Initialize with the length of the first day's time slots
      let maxDay = timeSlotsV2[0].day; // Initialize with the name of the first day

      // Find the day with the biggest empty slots
      timeSlotsV2.forEach((day) => {
        if (day.slots.length > maxSlots) {
          maxSlots = day.slots.length;
          maxDay = day.day;
        }
      });


      // Find the selected course ID
      const selectedCourseID = this.allCoursesRemove.find((course) => course.name === this.selectedCourse)?.id;

      // Find the earliest slot on the day with the biggest gap
      let emptySlotToBeAdded: any;
      //create an empty CourseInsideMajor so we can add it to the schedule
      let slotToBeAdded: CourseInsideMajor[] = [];

      if (selectedCourseID) {
        //find the atching day and if found initalzied the emptySlotToBeAdded to the the first index of the array , such as     { day: 'sunday', slots: sundayTimeSlots }
        const dayWithMaxSlots = timeSlotsV2.find(day => day.day === maxDay);
        if (dayWithMaxSlots && dayWithMaxSlots.slots.length > 0) {
          emptySlotToBeAdded = dayWithMaxSlots.slots[0];

          // Extract the time slot from the string
          const timeSlot = emptySlotToBeAdded.split(" - ")[1];
          //create the courseInsideMajor instanceof with the retrived values
          const courseInsideMajor: CourseInsideMajor = {
            courseId: selectedCourseID!, // Add "!" to assert that selectedCourseID is non-null
            timeSlot: timeSlot,
            title: this.selectedCourse,
            description: 'autoFill V2',
            room: 'room 1'
          };

          //push the new courseInsideMajor to the currentMajor so we can update it in the database.
          days.forEach(day => {
            const schedule = (this.currentMajor?.schedule as any)?.[day];
            if (schedule) {
              if (day === maxDay) {
                schedule.push(courseInsideMajor);
              }
            }
          });
        }
      }
      console.log(this.currentMajor);
    }
  }
  //Autofill END

  callUpdate() {
    this.Autofill();
    setTimeout(() => {
      this.updateScheduleInDatabase(); // will happen after 5 seconds
    }, 3000); // 5000 milliseconds = 5 seconds
  }

}