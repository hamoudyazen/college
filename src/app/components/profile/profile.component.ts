import { Component, OnInit } from '@angular/core';
import { Toast } from 'bootstrap';
import { AuthService } from 'src/app/AuthService';
import { Course } from 'src/app/Course';
import { User } from 'src/app/user';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  id: string | undefined;
  errorMessage: string | undefined;
  successMessage: string | undefined;
  name: string | undefined;
  userDetails: User[] = [];

  constructor(private authService: AuthService) { }
  showLiveToast() {
    const liveToastEl = document.getElementById('liveToast');
    if (liveToastEl) {
      const liveToast = new Toast(liveToastEl);
      liveToast.show();
    }
  }
  ngOnInit(): void {

    //to call the getName function
    const email = localStorage.getItem('email');
    console.log('email', email);
    if (email) {
      this.authService.getID(email).subscribe(
        response => {
          this.id = response.id;
          this.authService.getUserDetails(this.id).subscribe(
            response => {
              this.userDetails = response;
              console.log('details', this.userDetails);
              this.name = this.userDetails[0].firstname;
            },
            error => this.errorMessage = 'Failed to get teacher details'
          );
        },
        error => console.log('Failed to get teacher id:', error)
      );
    }


  }

}
