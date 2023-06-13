import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { error } from 'jquery';
import { User } from 'src/app/models/allModels';
import { Major } from 'src/app/models/allModels';
import { SharedService } from 'src/app/services/SharedService';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // Login
  loginRequest: any = {
    email: '',
    password: ''
  };
  // END

  // Register
  date = new Date();
  majors: Major[] = [];
  registerRequest: User = {
    id: '',
    editingSchedule: false,
    firstname: '',
    lastname: '',
    birthday: this.date,
    email: '',
    password: '',
    role: '',
    major: '',
    image: '',
    enrollmentDate: this.date.toString()
  };
  // END

  // Register
  allUsers: User[] = [];
  showForgotPasswordEmailCard = true;
  showForgotPasswordBirthdate = false;
  showForgotPasswordPassword = false;
  forgotPasswordEmail: string = "";
  forgotPasswordBirthdate!: Date;
  forgotPasswordPassword: string = "";
  // END

  //page settings
  showLogin: boolean = true;
  showRegister: boolean = false;
  showForgotPassword: boolean = false;
  //END

  constructor(private authService: AuthService, private router: Router, private http: HttpClient, private SharedService: SharedService) { }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      //get all the majors names for sign up purposes
      this.majors = await this.SharedService.getAllMajorsAdmin();
      this.allUsers = await this.SharedService.getAllUsers();

    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }

  //toggle component to show which card
  toggleComponent(card: string) {
    this.showLogin = true;
    this.showRegister = false;
    this.showForgotPassword = false;
    if (card === 'login') {
      this.showLogin = true;
      this.showRegister = false;
      this.showForgotPassword = false;
    } else if (card === 'Register') {
      this.showLogin = false;
      this.showRegister = true;
      this.showForgotPassword = false;
    } else if (card === 'Forgot password') {
      this.showLogin = false;
      this.showRegister = false;
      this.showForgotPassword = true;
    }
  }
  //end



  //Login functionality
  loginOnSubmit() {
    this.authService.login(this.loginRequest).subscribe(res => {
      //if login was a success (1) , move depedning on the role
      if (res === 1) {
        //save the email for later on usage
        localStorage.setItem('email', this.loginRequest.email);
        //get the role
        this.authService.getRole(this.loginRequest.email).subscribe(roleRes => {
          //set the role in the storage for Guard authentacation
          localStorage.setItem('role', roleRes.role);
          if (roleRes.role === 'student') {
            this.router.navigateByUrl('/student');
          }
          if (roleRes.role === 'admin') {
            this.router.navigateByUrl('/admin');
          }
          if (roleRes.role === 'teacher') {
            this.router.navigateByUrl('/teacher');
          }
        }, error => {
          alert('role not valid , view Error in console');
          console.log(error);
        });
      }
    }, error => {
      alert('login credential not valid , view Error in console')
      console.log(error);
    });
  }
  //End login




  //Register functionality
  registerOnSubmit() {
    this.authService.register(this.registerRequest).subscribe(res => {
      alert('Registeration sucessful , verify you email')
    }, error => {
      alert('Registeration failed, check console');
      console.log(error);
    });
  }
  //End register 




  //Forgot password functionality

  //verify email
  forgotPasswordEmailOnSubmit() {
    let isFound: boolean = false;
    for (let i = 0; i < this.allUsers.length; i++) {
      if (this.allUsers[i].email === this.forgotPasswordEmail) {
        isFound = true;
      }
    }

    if (isFound) {
      this.showForgotPasswordEmailCard = false;
      this.showForgotPasswordBirthdate = true;
    }
    else {
      alert('Email not valid');
    }
  }

  //verify birthdate
  forgotPasswordBirthdateOnSubmit() {
    let isValidBirthDate: boolean = false;
    console.log(this.allUsers[0].birthday);
    for (let i = 0; i < this.allUsers.length; i++) {
      if (this.allUsers[i].email === this.forgotPasswordEmail) {
        if (this.allUsers[i].birthday === this.forgotPasswordBirthdate) {
          isValidBirthDate = true;
        }
      }
    }

    if (isValidBirthDate) {
      this.showForgotPasswordEmailCard = false;
      this.showForgotPasswordBirthdate = false;
      this.showForgotPasswordPassword = true;
    }
    else {
      alert('Birthdate not valid');

    }
  }

  //change password
  forgotPasswordPasswordOnSubmit(formData: any, originalPassword: any, userId: any) {
    const newPassword = formData.password;
    this.authService.updateProfilePassword(newPassword, originalPassword, userId).subscribe(
      (response) => {
        alert('Password updated successfully');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      (error) => {
        alert('Password didnt update')
      },
    );
  }
  //End Forgot password 

}
