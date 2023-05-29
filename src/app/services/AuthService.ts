import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Assignment, Course, Submission, ForgotPasswordResponse, CourseMaterial, LoginRequest, User, SundaySchedule, Major } from '../models/allModels';

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
    return this.http.post<ForgotPasswordResponse>(`${this.baseUrl}/email-verification?email=${email}`, {});
  }


  //logs the user in
  loginn(loginRequest: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, loginRequest);
  }

  getID(email: any): Observable<{ id: string }> {
    return this.http.get<{ id: string }>(
      `${this.baseUrl}/getId?email=${email}`
    );
  }




  getTeacherCourses(id: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/getTeacherCourses?id=${id}`);
  }

  getUserDetails(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/getUserDetails?email=${email}`);
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

  getRole(email: string): Observable<{ role: string }> {
    return this.http.get<{ role: string }>(
      `${this.baseUrl}/getRole?email=${email}`
    );
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////// PROFILE ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  updateProfileEmail(newEmail: any, oldEmail: any, userId: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateProfileEmail?newEmail=${newEmail}&oldEmail=${oldEmail}&userId=${userId}`, {}, { responseType: 'text' });
  }

  updateProfileFirstname(newEmail: any, oldEmail: any, userId: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateProfileFirstname?newEmail=${newEmail}&oldEmail=${oldEmail}&userId=${userId}`, {}, { responseType: 'text' });
  }


  updateProfileLastname(newEmail: any, oldEmail: any, userId: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateProfileLastname?newEmail=${newEmail}&oldEmail=${oldEmail}&userId=${userId}`, {}, { responseType: 'text' });
  }

  updateProfilePassword(newEmail: any, oldEmail: any, userId: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateProfilePassword?newEmail=${newEmail}&oldEmail=${oldEmail}&userId=${userId}`, {}, { responseType: 'text' });
  }

  updateProfilePicture(downloadURL: any, userId: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateProfilePicture?downloadURL=${downloadURL}&userId=${userId}`, {}, { responseType: 'text' });
  }

  isEmailExists(email: any): Observable<boolean> {
    return this.http.put<boolean>(`${this.baseUrl}/isEmailExists?email=${email}`, {});
  }

  isBirthdaySame(birthday: any): Observable<boolean> {
    return this.http.put<boolean>(`${this.baseUrl}/isBirthdaySame?birthday=${birthday}`, {});
  }

  updatePassword(newPassword: any, email: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updatePassword?newPassword=${newPassword}&email=${email}`, {}, { responseType: 'text' });
  }

  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //
  addAssignment(assignment: Assignment): Observable<any> {
    console.log('Sending assignment request:', assignment);
    return this.http.post(`${this.baseUrl}/addAssignment`, assignment);
  }

  updateAssignmentLink(downloadURL: any, assignmentId: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateAssignmentLink?downloadURL=${downloadURL}&assignmentId=${assignmentId}`, {}, { responseType: 'text' });
  }
  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //
  showAvailableCoursesForStudent(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/ShowAvailableCoursesForStudent`);
  }
  StudentCourses(email: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/StudentCourses?email=${email}`);
  }

  registerForCourse(courseID: string, email: string): Observable<boolean> {
    const params = new HttpParams()
      .set('courseID', courseID)
      .set('email', email);
    return this.http.post<boolean>(`${this.baseUrl}/RegisterForCourse`, params);
  }

  studentAssignments(email: string): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.baseUrl}/StudentAssignments?email=${email}`);
  }

  addSubmission(submission: Submission): Observable<any> {
    console.log('Sending submission request:', submission);
    return this.http.post<any>(`${this.baseUrl}/submissions`, submission);
  }

  updateSubmissionLink(downloadURL: any, submissionId: any): Observable<any> {
    const params = new HttpParams()
      .set('downloadURL', downloadURL)
      .set('submissionId', submissionId);
    return this.http.put(`${this.baseUrl}/updateSubmissionLink`, {}, { params, responseType: 'text' });
  }

  teacherAssignmentsSubmissions(email: string): Observable<Submission[]> {
    return this.http.get<Submission[]>(`${this.baseUrl}/teacherAssignmentsSubmissions`, { params: { email } });
  }


  studentMySubmissions(id: any): Observable<Submission[]> {
    return this.http.get<Submission[]>(`${this.baseUrl}/studentMySubmissions`, { params: { id } });
  }

  studentDeleteSubmission(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/studentDeleteSubmission?id=${id}`);
  }

  addCourseMaterial(courseMaterial: CourseMaterial): Observable<any> {
    return this.http.post(`${this.baseUrl}/CourseMaterial`, courseMaterial);
  }

  showAllCourseMaterials(): Observable<CourseMaterial[]> {
    return this.http.get<CourseMaterial[]>(`${this.baseUrl}/showAllCourseMaterials`);
  }

  addTeacherWeeklyTimeSlots(data: any): Observable<any> {
    console.log('Sending addTeacherWeeklyTimeSlots request:', data);
    return this.http.post(`${this.baseUrl}/addTeacherWeeklyTimeSlots`, data);
  }


  addSundaySchedule(schedule: SundaySchedule): Observable<any> {
    console.log('Sending register request:', schedule);
    return this.http.post(`${this.baseUrl}/addSundaySchedule`, schedule);
  }

  getMajorCourses(majorName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getMajorCourses?majorName=${majorName}`);
  }

  getCourseDetails(id: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/getCourseDetails?id=${id}`);
  }


  addPublicSchedule(schedule: any): Observable<any> {
    console.log('Sending assignment request:', schedule);
    return this.http.post(`${this.baseUrl}/addPublicSchedule`, schedule);
  }
  createMajor(major: Major): Observable<any> {
    return this.http.post(`${this.baseUrl}/createMajor`, major);
  }

  getMajorDetails(majorName: string): Observable<Major[]> {
    return this.http.get<Major[]>(`${this.baseUrl}/getMajorDetails?majorName=${majorName}`);
  }

  updateSchedule(major: Major): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateSchedule`, major);
  }

  updateScheduleRemove(major: Major): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateScheduleRemove`, major);
  }

  updateScheduleEditStatus(id: string, status: boolean): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateScheduleEditStatus?id=${id}&status=${status}`, {});
  }


  getUserCourses(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getUserCourses?email=${email}`);
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/getAllCourses`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/getAllUsers`);
  }

  deleteUserAdmin(email: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteUserAdmin?email=${email}`);
  }


  updateUserEmailAdmin(userId: string, newEmail: string): Observable<any> {
    const url = `${this.baseUrl}/updateUserEmailAdmin`;
    const body = {
      userId: userId,
      newEmail: newEmail
    };
    return this.http.put(url, body);
  }

  getAllCoursesAdmin(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/getAllCoursesAdmin`);
  }

  deleteCourseAdmin(courseID: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteCourseAdmin?courseID=${courseID}`);
  }

  getAllMajorsAdmin(): Observable<Major[]> {
    return this.http.get<Major[]>(`${this.baseUrl}/getAllMajorsAdmin`);
  }

  getStudentCoursesList(email: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/getStudentCoursesList?email=${email}`);
  }

  deleteStudentFromCourse(email: string, courseId: string): Observable<any> {
    const params = new HttpParams().set('email', email).set('courseId', courseId);
    return this.http.delete(`${this.baseUrl}/deleteStudentFromCourse`, { params });
  }


}
