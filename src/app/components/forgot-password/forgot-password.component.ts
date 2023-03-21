import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/AuthService';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  email : string = '';


  constructor( private formBuilder: FormBuilder,  private auth: AuthService) {}

  ngOnInit() {

  }
  forgotPassword() {
  //  this.auth.forgotPassword(this.email);
    //this.email = '';
  }

}
