import { Component, Renderer2, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/AuthService';
import { Router } from '@angular/router';
import { Toast } from 'bootstrap';
import { Assignment, Course, Submission, ForgotPasswordResponse, CourseMaterial, LoginRequest, User } from 'src/app/models/allModels';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  noAccessButton: boolean = false;
  current_ip_address: any;
  loginCounter: number = 0;
  myMap = new Map<any, any>();
  errorMessage: string | undefined;
  email: any;
  password: string | undefined;
  name: string | undefined;
  counter: number = 5;
  isRedirecting: boolean = false;
  loginForm: any;
  successMessage: any;
  currentRole: any | undefined;

  id: string | undefined;

  userDetails: User[] = [];
  isAccountExists: boolean = false;
  isBirthdaySame: boolean = false;
  formValue1: string = '';
  formValue2: string = '';
  formValue3: string = '';

  emailToRest: string = '';


  user: User = {
    firstname: '',
    lastname: '',
    birthday: new Date(),
    email: '',
    password: '',
    role: '',
    major: '',
    image: '' // set the default value for the new "image" field
  };

  constructor(private authService: AuthService, private router: Router, private renderer: Renderer2,
    private http: HttpClient) { }
  showLiveToast() {
    const liveToastEl = document.getElementById('liveToast');
    if (liveToastEl) {
      const liveToast = new Toast(liveToastEl);
      liveToast.show();
    }
  }

  ngOnInit(): void {
    const storedData = JSON.parse(localStorage.getItem('loginData') || '{}');
    const lastAttemptTime = storedData.lastAttemptTime || 0;
    const loginCounter = storedData.loginCounter || 0;

    // Check if the user has exceeded the maximum number of login attempts
    const noAccessButton = this.checkUserLimit(loginCounter, lastAttemptTime);

    const script = this.renderer.createElement('script');
    script.src = '/assets/js/login.js';
    script.type = 'text/javascript';
    script.onload = () => {
      const ipAddress = (window as any).getIP();
      console.log(ipAddress); // handle the returned IP address here
      localStorage.setItem('ipAddress', ipAddress);
      this.current_ip_address = ipAddress;
    };
    this.renderer.appendChild(document.head, script);
    //forgot password
    //to call the getID function
    const email = localStorage.getItem('email');
    if (email) {
      this.authService.getID(email).subscribe(
        response => {
          this.id = response.id;
          this.authService.getUserDetails(this.id).subscribe(
            response => {
              this.userDetails = response;
              this.name = this.userDetails[0].firstname;
            },
            error => this.errorMessage = 'Failed to get teacher details'
          );

          // Call getRole() method here
          this.authService.getRole(this.id).subscribe(
            response => {
              localStorage.setItem('role', response.role);
            }
          );
        },
        error => console.log('')
      );
    }



  }


  //////////////////////////////////////////////////////////////////////////////////////////////////// LOGIN  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  login() {
    const loginRequest = {
      email: this.email,
      password: this.password,
    };

    localStorage.setItem('email', this.email);
    console.log('email is : ', this.email);
    const storedData = JSON.parse(localStorage.getItem('loginData') || '{}');
    const lastAttemptTime = storedData.lastAttemptTime || 0;
    const loginCounter = storedData.loginCounter || 0;

    // Check if the user has exceeded the maximum number of login attempts
    const noAccessButton = this.checkUserLimit(loginCounter, lastAttemptTime);

    if (!noAccessButton) {
      this.authService.loginn(loginRequest).subscribe(
        (response) => {
          console.log(response);
          localStorage.setItem('email', this.email || '');
          if (response === 1) {
            console.log(1);
            this.authService.getRole(this.email || '').subscribe(
              (roleResponse) => {
                localStorage.setItem('role', roleResponse.role);
                this.authService.getUserDetails(this.email || '').subscribe(
                  userDetailsResponse => {
                    localStorage.setItem('userDetails', JSON.stringify(userDetailsResponse));
                    this.userDetails = userDetailsResponse;
                  },
                );
                if (roleResponse.role === 'teacher') {
                  this.router.navigateByUrl('/teacher');
                } else if (roleResponse.role === 'student') {
                  this.router.navigateByUrl('/student');
                } else if (roleResponse.role === 'admin') {
                  this.router.navigateByUrl('/admin');
                } else {
                  console.log("Invalid role");
                }
              },
            );
          } else if (response === 0) {
            console.log("0");
          }
        }
      );
    } else {
      alert('You have exceeded the maximum number of login attempts. Please try again later.');
    }
  }


  checkUserLimit(loginCounter: string, lastAttemptTime: number) {
    const storedData = JSON.parse(localStorage.getItem('loginData') || '{}');

    if (Date.now() - lastAttemptTime > 5 * 60 * 1000) {
      // Reset the login counter if the last attempt was more than 5 minutes ago
      storedData.loginCounter = 1;
    } else {
      // Increment the login counter if the last attempt was less than 5 minutes ago
      storedData.loginCounter = loginCounter + 1;
    }

    storedData.lastAttemptTime = Date.now();
    localStorage.setItem('loginData', JSON.stringify(storedData));

    if (storedData.loginCounter >= 50) {
      // Disable the login button if the user has exceeded the maximum number of login attempts
      this.noAccessButton = true;
      setTimeout(() => {
        this.noAccessButton = false;
      }, 5 * 60 * 1000); // re-enable the button after 5 minutes
      return true;
    } else {
      return false;
    }
  }



  //////////////////////////////////////////////////////////////////////////////////////////////////// FORGOT PASSWORD ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  isValidPassword(value: any) {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const newPassword = value.password?.trim();
    const oldPassword = value.originalPassword?.trim();
    return newPassword && newPassword.length >= 8 && pattern.test(newPassword) && newPassword !== oldPassword;
  }
  //EMAIL - STEP 1
  verifyform1(value: string) {
    this.checkEmailExists(value);
  }

  isValidEmail(value: any) {
    const newName = value.email?.trim();
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return newName && emailPattern.test(newName);
  }

  checkEmailExists(email: string): void {
    this.authService.isEmailExists(email).subscribe(result => {
      this.emailToRest = email;
      this.isAccountExists = result;
      this.successMessage = 'Email matches';
      this.errorMessage = '';
    }, error => {
      this.successMessage = '';
      this.errorMessage = 'email doesnt match';
    });
  }

  //VERIFY - STEP 2

  verifyform2(value: string) {
    this.checkBirthdaySame(value);
  }
  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }


  checkBirthdaySame(birthday: string): void {
    this.authService.isBirthdaySame(birthday).subscribe(
      result => {
        if (result) {
          this.successMessage = 'Birthday Correct';
          this.errorMessage = '';
        } else {
          this.successMessage = '';
          this.errorMessage = 'Birthday Incorrect';
        }
        this.isBirthdaySame = result;
      },
      error => {
        this.successMessage = '';
        this.errorMessage = 'An error occurred while checking the birthday';
      }
    );
  }



  /// PASSWORD RESET - STEP 3

  updateProfilePassword(formData: any) {
    const newPassword = formData.password;
    this.authService.updatePassword(newPassword, this.emailToRest).subscribe(
      (response) => {
        setTimeout(() => {
          location.reload();
        }, 2000);
      },
    );
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////// REGISTER ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  onSubmit() {
    this.authService.register(this.user).subscribe(
      () => {
        this.router.navigateByUrl('/login');
        this.successMessage = 'Registration successfully , please check your mailbox';
        setTimeout(() => {
          location.reload();
        }, 2000);
      },
      (error) => {
        if (error.error && error.error.message && error.error.message === 'User Already Exist') {
          this.errorMessage = 'User with this email already exist';
        }
        else if (error.error && error.error.message && error.error.message === 'Password Short') {
          this.errorMessage = 'Password Short';
        }
        else {
          this.errorMessage = 'An error occurred during registration , Please try again later..';
        }
      }
    );
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

}
