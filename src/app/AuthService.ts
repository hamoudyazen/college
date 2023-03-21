import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    private http: HttpClient,
    private fireauth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
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

  login(email: string, password: string) {
    this.fireauth
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        localStorage.setItem('email', res.user?.email || '');
        localStorage.setItem('name', res.user?.displayName || '');
        if (res.user?.emailVerified) {
          for (let i = 0; i < this.users!.length; i++) {
            if (this.users![i].email === email) {
              this.role = this.users![i].role;
            }
          }
          if (this.role === 'student') {
            localStorage.setItem('student', 'true');
            localStorage.setItem('token', 'true');
            this.router.navigate(['/home']);
          } else if (this.role === 'teacher') {
            localStorage.setItem('teacher', 'true');
            localStorage.setItem('token', 'true');
            this.router.navigate(['/teacher']);
          } else if (this.role === 'admin') {
            localStorage.setItem('admin', 'true');
            localStorage.setItem('token', 'true');
            this.router.navigate(['/admin']);
          }
        } else {
          alert('Email not verified');
        }
      })
      .catch(err => {
        alert(err.message);
        this.router.navigate(['/login']);
      });
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

  registerr(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  loginn(loginRequest: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, loginRequest);
  }


  getAllUserss(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }

  getAllCoursess(): Observable<any> {
    return this.http.get(`${this.baseUrl}/courses`);
  }
}

