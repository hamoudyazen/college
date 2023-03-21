import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UserListComponent } from './user-list/user-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './dashboards/admin/admin.component';
import { TeacherComponent } from './dashboards/teacher/teacher.component';
import { StudentComponent } from './dashboards/student/student.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { CoursesComponent } from './dashboards/teacher/courses/courses.component';

const routes: Routes = [
  {path: '', redirectTo:'login', pathMatch:'full'},
  {path:"login",component:LoginComponent},
  {path:"list",component:UserListComponent},
  {path:"register",component:RegisterComponent},
  {path:"admin",component:AdminComponent},
  {path:"teacher",component:TeacherComponent},
  {path:"student",component:StudentComponent},
  {path:"forgot-password",component:ForgotPasswordComponent},
  {path:"courses",component:CoursesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
