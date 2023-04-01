import { Course } from './Course';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from './user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ForgotPasswordResponse } from './ForgotPasswordResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  role: string | undefined;
  private baseUrl = 'http://localhost:8080';
  errorMessage: string | undefined;
  teacherCourses: Course[] = [];

  constructor(
    private http: HttpClient,
    private fireauth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) { }

  addCourse(course: Course) {
    return this.http.post(`${this.baseUrl}/add-course`, course);
  }
  //register a new user
  register(user: User): Observable<any> {
    console.log('Sending register request:', user);
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  //sends a rest password
  resetPassword(email: string): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(
      `${this.baseUrl}/forgot-password?email=${email}`,
      {}
    );
  }

  //sends a verify email
  verifyEmail(email: string): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(
      `${this.baseUrl}/email-verification?email=${email}`,
      {}
    );
  }

  //logs the user out (not complete)
  logout() {
    this.fireauth
      .signOut()
      .then(() => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  //logs the user in
  loginn(loginRequest: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, loginRequest);
  }

  getID(email: string): Observable<{ id: string }> {
    return this.http.get<{ id: string }>(
      `${this.baseUrl}/getId?email=${email}`
    );
  }



  getTeacherCourses(id: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/getTeacherCourses?id=${id}`);
  }

  getUserDetails(id: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/getUserDetails?id=${id}`);
  }



  registerCourse(course: Course): Observable<any> {
    console.log('Sending register request:', course);
    return this.http.post(`${this.baseUrl}/registercourse`, course);
  }


  updateEmail(courseId: string, oldEmail: string, newEmail: string): Observable<any> {
    const request = {
      courseId: courseId,
      originalEmail: oldEmail,
      updatedEmail: newEmail
    };
    return this.http.put(`${this.baseUrl}/updateEmail?courseId=${courseId}&originalEmail=${oldEmail}&updatedEmail=${newEmail}`, null);
  }
  deleteEmail(courseId: string, email: string): Observable<any> {
    const request = {
      courseId: courseId,
      email: email
    };
    return this.http.delete(`${this.baseUrl}/deleteEmail?courseId=${courseId}&email=${email}`);
  }

  addStudent(courseId: string, newEmail: string): Observable<any> {
    const request = {
      courseId: courseId,
      newEmail: newEmail
    };
    return this.http.post(`${this.baseUrl}/addStudent`, request);
  }

  getName(email: string): Observable<{ firstname: string }> {
    return this.http.get<{ firstname: string }>(
      `${this.baseUrl}/getName?email=${email}`
    );
  }

}
