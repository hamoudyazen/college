import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import 'bootstrap';
import '@popperjs/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './dashboards/admin/admin.component';
import { TeacherComponent } from './dashboards/teacher/teacher.component';
import { StudentComponent } from './dashboards/student/student.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { LayoutModule } from '@angular/cdk/layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterCourseComponent } from './dashboards/teacher/register-course/register-course.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainComponent } from './main/main.component';
import { TeacherMyCoursesComponent } from './dashboards/teacher/teacher-my-courses/teacher-my-courses.component';
import { ProfileComponent } from './components/profile/profile.component';
import { provideStorage, getStorage } from '@angular/fire/storage'
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AssignmentsComponent } from './dashboards/teacher/assignments/assignments.component';
import { StudentassignmentComponent } from './dashboards/student/studentassignment/studentassignment.component';
import { StudentcoursesComponent } from './dashboards/student/studentcourses/studentcourses.component';
import { StudentRegisterForCourseComponent } from './dashboards/student/student-register-for-course/student-register-for-course.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    TeacherComponent,
    StudentComponent,
    RegisterCourseComponent,
    VerifyEmailComponent,
    MainComponent,
    TeacherMyCoursesComponent,
    ProfileComponent,
    AssignmentsComponent,
    StudentassignmentComponent,
    StudentcoursesComponent,
    StudentRegisterForCourseComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    LayoutModule,
    NgbModule,
    provideStorage(() => getStorage()),
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
