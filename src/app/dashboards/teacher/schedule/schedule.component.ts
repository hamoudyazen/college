import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/allModels';
import { AuthService } from 'src/app/services/AuthService';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  sundayCheckedCount = 0;
  mondayCheckedCount = 0;
  tuesdayCheckedCount = 0;
  wednesdayCheckedCount = 0;
  thursdayCheckedCount = 0;

  isButtonDisabled = true;

  sundayArray: String[] = [];
  mondayArray: String[] = [];
  tuesdayArray: String[] = [];
  wednesdayArray: String[] = [];
  thursdayArray: String[] = [];

  currentUseID!: any;
  currentUser: User[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {

    //get the id first
    const email = localStorage.getItem('email') as string;
    this.authService.getID(email).subscribe((result) => {
      this.currentUseID = result.id;
    });
    //get the full details of the user
    this.authService.getUserDetails(this.currentUseID).subscribe((result) => {
      this.currentUser = result;
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

  //mondayCounter
  onMondayCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.mondayCheckedCount = this.mondayCheckedCount + 1;
    }
    else {
      this.mondayCheckedCount = this.mondayCheckedCount - 1;

    }
    if (this.mondayCheckedCount >= 3) {
      this.isButtonDisabled = false;
    }
    else {
      this.isButtonDisabled = true;
    }
  }


  //TuesdayCounter
  onTuesdayCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.tuesdayCheckedCount = this.tuesdayCheckedCount + 1;
    }
    else {
      this.tuesdayCheckedCount = this.tuesdayCheckedCount - 1;

    }
    if (this.tuesdayCheckedCount >= 3) {
      this.isButtonDisabled = false;
    }
    else {
      this.isButtonDisabled = true;
    }
  }

  //wednesdayCounter
  onWednesdayCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.wednesdayCheckedCount = this.wednesdayCheckedCount + 1;
    }
    else {
      this.wednesdayCheckedCount = this.wednesdayCheckedCount - 1;

    }
    if (this.wednesdayCheckedCount >= 3) {
      this.isButtonDisabled = false;
    }
    else {
      this.isButtonDisabled = true;
    }
  }

  //thursdayCounter
  onThursdayCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.thursdayCheckedCount = this.thursdayCheckedCount + 1;
    }
    else {
      this.thursdayCheckedCount = this.thursdayCheckedCount - 1;

    }
    if (this.thursdayCheckedCount >= 3) {
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
      this.sundayArray = selectedSlots;

      // Do something with the selected time slots
      console.log(this.sundayArray);    // your form submission logic goes here
      this.isButtonDisabled = true;

    }
    else {
      alert("Please select atleast 3 time slots");
    }
  }

  submitMondayAvailability(event: Event) {
    if (this.isButtonDisabled == false) {
      event.preventDefault();
      const formData = new FormData(event.target as HTMLFormElement);

      // Retrieve the selected checkboxes as an array of values
      const selectedSlots = Array.from(formData.getAll('time-slot-monday[]'), (entry: FormDataEntryValue) => String(entry));
      this.mondayArray = selectedSlots;

      // Do something with the selected time slots
      console.log(this.mondayArray);    // your form submission logic goes here
      this.isButtonDisabled = true;

    }
    else {
      alert("Please select atleast 3 time slots");
    }
  }

  submitTuesdayAvailability(event: Event) {
    if (this.isButtonDisabled == false) {
      event.preventDefault();
      const formData = new FormData(event.target as HTMLFormElement);

      // Retrieve the selected checkboxes as an array of values
      const selectedSlots = Array.from(formData.getAll('time-slot-tuesday[]'), (entry: FormDataEntryValue) => String(entry));
      this.tuesdayArray = selectedSlots;

      // Do something with the selected time slots
      console.log(this.mondayArray);    // your form submission logic goes here
      this.isButtonDisabled = true;

    }
    else {
      alert("Please select atleast 3 time slots");
    }
  }

  submitWednesdayAvailability(event: Event) {
    if (this.isButtonDisabled == false) {
      event.preventDefault();
      const formData = new FormData(event.target as HTMLFormElement);

      // Retrieve the selected checkboxes as an array of values
      const selectedSlots = Array.from(formData.getAll('time-slot-wednesday[]'), (entry: FormDataEntryValue) => String(entry));
      this.wednesdayArray = selectedSlots;

      // Do something with the selected time slots
      console.log(this.wednesdayArray);    // your form submission logic goes here
      this.isButtonDisabled = true;

    }
    else {
      alert("Please select atleast 3 time slots");
    }
  }

  submitThursdayAvailability(event: Event) {
    if (this.isButtonDisabled == false) {
      event.preventDefault();
      const formData = new FormData(event.target as HTMLFormElement);

      // Retrieve the selected checkboxes as an array of values
      const selectedSlots = Array.from(formData.getAll('time-slot-thursday[]'), (entry: FormDataEntryValue) => String(entry));
      this.thursdayArray = selectedSlots;

      // Do something with the selected time slots
      console.log(this.wednesdayArray);    // your form submission logic goes here
      this.isButtonDisabled = true;

    }
    else {
      alert("Please select atleast 3 time slots");
    }
  }

  submitToAllArray() {
    const data = {
      id: 'sad',
      sundayArray: this.sundayArray,
      mondayArray: this.mondayArray,
      tuesdayArray: this.tuesdayArray,
      wednesdayArray: this.wednesdayArray,
      thursdayArray: this.thursdayArray
    };
    this.authService.addTeacherWeeklyTimeSlots(data).subscribe(
      (data) => {
        console.log(data);
        alert('Time slots added successfully');
      },
      (error) => {
        console.error(error);
        alert('Error adding time slots');
      }
    );
  }




}
