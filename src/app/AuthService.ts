import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from './user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Course } from './courses';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  users: User[] | undefined;
  courses: Course[] | undefined;
  role: string | undefined;
  private baseUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient, private fireauth: AngularFireAuth, private firestore: AngularFirestore, private router: Router) {
    this.getAllUsers().subscribe(users => {
      this.users = users;
    });

    this.getAllCourses().subscribe(courses => {
      this.courses = courses;
    });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/courses`);
  }

  register(user: User): Observable<any> {
    console.log('Sending register request:', user);
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  forgotPassword(email: string) {
    this.fireauth
      .sendPasswordResetEmail(email)
      .then(() => {
        this.router.navigate(['/verify-email']);
      })
      .catch(err => {
        alert('Something went wrong');
      });
  }

  logout() {
    this.fireauth
      .signOut()
      .then(() => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      })
      .catch(err => {
        alert(err.message);
      });
  }

  loginn(loginRequest: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, loginRequest);
  }


  getUserName(email: string) {
    const url = `${this.baseUrl}/username?email=${email}`;
    return this.http.get<string>(url).pipe(
      map(response => response === "User not found or multiple users found" ? "" : response)
    );
  }

  addCourse(course: Course): Observable<any> {
    console.log('Sending add course request:', course);
    return this.http.post(`${this.baseUrl}/addcourses`, course);
  }

}

