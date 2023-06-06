import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import 'bootstrap';
import '@popperjs/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, NgModel } from '@angular/forms';
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
import { TeacherMyCoursesComponent } from './dashboards/teacher/teacher-my-courses/teacher-my-courses.component';
import { ProfileComponent } from './components/profile/profile.component';
import { provideStorage, getStorage } from '@angular/fire/storage'
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AssignmentsComponent } from './dashboards/teacher/assignments/assignments.component';
import { StudentassignmentComponent } from './dashboards/student/studentassignment/studentassignment.component';
import { StudentcoursesComponent } from './dashboards/student/studentcourses/studentcourses.component';
import { StudentRegisterForCourseComponent } from './dashboards/student/student-register-for-course/student-register-for-course.component';
import { ChatComponent } from './components/chat/chat.component';



import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthGuard } from './services/AuthGuard';
import { StudentscheduleComponent } from './dashboards/student/studentschedule/studentschedule.component';
import { ScheduleComponent } from './dashboards/teacher/schedule/schedule.component';
import { Socket } from 'ngx-socket-io';
import { SharedService } from './services/SharedService';
import { StudentsadminComponent } from './dashboards/admin/studentsadmin/studentsadmin.component';
import { CoursesadminComponent } from './dashboards/admin/coursesadmin/coursesadmin.component';
import { SchedulesComponent } from './dashboards/admin/schedules/schedules.component';
import { FinancialComponent } from './dashboards/student/Financial Folder/financial/financial.component';
import { FinancialAddComponent } from './dashboards/student/Financial Folder/financial-add/financial-add.component';
import { FinancialAnalysisComponent } from './dashboards/student/Financial Folder/financial-analysis/financial-analysis.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    TeacherComponent,
    StudentComponent,
    RegisterCourseComponent,
    VerifyEmailComponent,
    TeacherMyCoursesComponent,
    ProfileComponent,
    AssignmentsComponent,
    StudentassignmentComponent,
    StudentcoursesComponent,
    StudentRegisterForCourseComponent,
    ChatComponent,
    StudentscheduleComponent,
    ScheduleComponent,
    StudentsadminComponent,
    CoursesadminComponent,
    SchedulesComponent,
    FinancialComponent,
    FinancialAddComponent,
    FinancialAnalysisComponent,
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
    NgbModule, MatAutocompleteModule, DatePipe, MatDividerModule,
    provideStorage(() => getStorage()),
    AngularFireStorageModule, MatFormFieldModule,
    NgxChartsModule,
  ],
  providers: [AuthGuard, SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }