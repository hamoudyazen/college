import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/allModels';
import { AuthService } from 'src/app/services/AuthService';
import { SundaySchedule } from 'src/app/models/allModels';
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  sundayCheckedCount = 0;
  isButtonDisabled = true;
  sundayArray: String[] = [];
  currentUser: User[] = [];
  currentEmail: any;
  currentId: any;
  schedule: SundaySchedule = {
    id: '',
    teacherId: 'teacher21',
    scheduleMajor: 'major12',
    sundayArray: []
  };
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.currentEmail = localStorage.getItem('email');
    this.authService.getUserDetails(this.currentEmail).subscribe(reponse => {
      this.currentUser = reponse;
      this.schedule.scheduleMajor = this.currentUser[0].major;
      this.currentId = this.currentUser[0].id;
    });
    this.authService.getID(this.currentEmail).subscribe(respone => {
      this.schedule.teacherId = respone.id;
    });
  }

  //sundayCounter
  onSundayCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.sundayCheckedCount = this.sundayCheckedCount + 1;
    }
    else {
      this.sundayCheckedCount = this.sundayCheckedCount - 1;

    }
    if (this.sundayCheckedCount >= 3) {
      this.isButtonDisabled = false;
    }
    else {
      this.isButtonDisabled = true;
    }
  }
  //submits
  submitSundayAvailability(event: Event) {
    if (this.isButtonDisabled == false) {
      event.preventDefault();
      const formData = new FormData(event.target as HTMLFormElement);

      // Retrieve the selected checkboxes as an array of values
      const selectedSlots = Array.from(formData.getAll('time-slot[]'), (entry: FormDataEntryValue) => String(entry));
      this.schedule.sundayArray = selectedSlots;

      this.authService.addSundaySchedule(this.schedule).subscribe(response => {
        console.log(response);
      });

      // Do something with the selected time slots
      console.log(selectedSlots);
      this.isButtonDisabled = true;

    }
    else {
      alert("Please select at least 3 time slots");
    }
  }



}
