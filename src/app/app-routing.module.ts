import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './dashboards/admin/admin.component';
import { TeacherComponent } from './dashboards/teacher/teacher.component';
import { StudentComponent } from './dashboards/student/student.component';
import { RegisterCourseComponent } from './dashboards/teacher/register-course/register-course.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { TeacherMyCoursesComponent } from './dashboards/teacher/teacher-my-courses/teacher-my-courses.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AssignmentsComponent } from './dashboards/teacher/assignments/assignments.component';
import { AuthGuard } from './services/AuthGuard';
import { StudentassignmentComponent } from './dashboards/student/studentassignment/studentassignment.component';
import { StudentcoursesComponent } from './dashboards/student/studentcourses/studentcourses.component';
import { StudentRegisterForCourseComponent } from './dashboards/student/student-register-for-course/student-register-for-course.component';
import { HttpClientModule } from '@angular/common/http';
import { ScheduleComponent } from './dashboards/teacher/schedule/schedule.component';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'teacher', component: TeacherComponent, canActivate: [AuthGuard], data: { roles: ['teacher'] } },
  { path: 'student', component: StudentComponent, canActivate: [AuthGuard], data: { roles: ['student'] } },


  //teacher
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'register course', component: RegisterCourseComponent, canActivate: [AuthGuard], data: { roles: ['teacher'] } },
  { path: 'teacher courses', component: TeacherMyCoursesComponent, canActivate: [AuthGuard], data: { roles: ['teacher'] } },
  { path: 'profile', component: ProfileComponent },
  { path: 'assignments', component: AssignmentsComponent, canActivate: [AuthGuard], data: { roles: ['teacher'] } },
  { path: 'teacherSchedule', component: ScheduleComponent, canActivate: [AuthGuard], data: { roles: ['teacher'] } },


  //student
  { path: 'studentAssignment', component: StudentassignmentComponent, canActivate: [AuthGuard], data: { roles: ['student'] } },
  { path: 'studentCourse', component: StudentcoursesComponent, canActivate: [AuthGuard], data: { roles: ['student'] } },
  { path: 'studentRegisterForCourses', component: StudentRegisterForCourseComponent, canActivate: [AuthGuard], data: { roles: ['student'] } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HttpClientModule],
  exports: [RouterModule],
})
export class AppRoutingModule { }
