import { Component, Renderer2, OnInit } from '@angular/core';
import { AuthService } from 'src/app/AuthService';
import { Router } from '@angular/router';
import { User } from 'src/app/user';
import { Toast } from 'bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  errorMessage: string | undefined;
  email: string | undefined;
  password: string | undefined;
  name: string | undefined;
  counter: number = 5;
  isRedirecting: boolean = false;
  loginForm: any;
  successMessage: any;

  //forgot password

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

  constructor(private authService: AuthService, private router: Router, private renderer: Renderer2) { }
  showLiveToast() {
    const liveToastEl = document.getElementById('liveToast');
    if (liveToastEl) {
      const liveToast = new Toast(liveToastEl);
      liveToast.show();
    }
  }


  ngOnInit(): void {
    const script = this.renderer.createElement('script');
    script.src = '/assets/js.js';
    script.type = 'text/javascript';
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

    this.authService.loginn(loginRequest).subscribe(
      (response) => {
        console.log(response);
        this.successMessage = 'Login successfully';
        localStorage.setItem('email', this.email || '');
        const role = localStorage.getItem('role') || '';
        if (role === 'teacher') {
          localStorage.setItem('loggedInTeacher', 'true');
          this.router.navigate(['/teacher']);
        } else if (role === 'student') {
          localStorage.setItem('loggedInStudent', 'true');
          this.router.navigate(['/student']);
        } else if (role === 'admin') {
          localStorage.setItem('loggedInAdmin', 'true');
          this.router.navigate(['/admin']);
        }

      },
      (error) => {
        if (error.error && error.error.message && error.error.message === 'Email is not verified') {
          this.errorMessage = 'Email is not verified , a verification email has been sent to your email address';
          this.isRedirecting = true;
          this.authService.verifyEmail(this.email || '').subscribe(
            (response) => {
              this.successMessage = 'Verification email sent successfully';
            }

          );
        }
        else if (error.error && error.error.message && error.error.message === 'Wrong Password') {
          this.errorMessage = 'Wrong Password';
        }
        else if (error.error && error.error.message && error.error.message === 'User Not Registered') {
          this.errorMessage = 'User Not Registered';
        }
        else {
          this.errorMessage =
            'An error occurred during Login , Please try again later..';
        }
      }
    );

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
