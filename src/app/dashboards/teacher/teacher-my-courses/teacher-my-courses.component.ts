import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/AuthService';
import { NgForm } from '@angular/forms';
import { Validators, FormControl } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Assignment, Course, Submission, ForgotPasswordResponse, CourseMaterial, LoginRequest, User } from 'src/app/models/allModels';
import { error } from 'jquery';
import { SharedService } from 'src/app/services/SharedService';

@Component({
  selector: 'app-teacher-my-courses',
  templateUrl: './teacher-my-courses.component.html',
  styleUrls: ['./teacher-my-courses.component.css']
})
export class TeacherMyCoursesComponent implements OnInit {
  showStudentsTableBoolean: boolean = false;
  studentsInCourse: any[] = [];
  selectedCourse: any;
  public file: any = {};
  date !: Date;
  showModal: boolean[] = [];
  courseID: any;

  courseMaterial: CourseMaterial = {
    materialCourseLink: '',
    materialCourseId: '',
    materialCourseName: '',
    materialCourseDescription: '',
  };

  onModalShow(index: number) {
    this.showModal[index] = true;
  }

  onModalHide(index: number) {
    this.showModal[index] = false;
  }

  //shared
  teacherCourses: Course[] = [];
  userDetails: User[] = [];
  currentEmail: any;
  id: any;
  firstname: any;
  lastname: any;
  email: any;
  password: any;
  role: any;
  name: any;
  profileImg: any;
  major: any;
  semester: any;
  //end of shared


  constructor(private authService: AuthService, private storage: AngularFireStorage, private firestore: AngularFirestore, private sharedService: SharedService) { }
  async ngOnInit(): Promise<void> {
    try {
      this.userDetails = await this.sharedService.getUserDetails();
      this.teacherCourses = await this.sharedService.getTeacherCourses();
      this.userDetails = this.sharedService.userDetails;
      this.email = this.sharedService.email;
      this.id = this.sharedService.id;
      this.firstname = this.sharedService.firstname;
      this.lastname = this.sharedService.lastname;
      this.password = this.sharedService.password;
      this.role = this.sharedService.role;
      this.name = this.sharedService.name;
      this.profileImg = this.sharedService.profileImg;
      this.major = this.sharedService.major;
      this.semester = this.sharedService.semester;
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }


  //ADD / DELETE STUDENT

  showStudentsTable() {
    for (let i = 0; i < this.teacherCourses.length; i++) {
      if (this.teacherCourses[i].name === this.selectedCourse) {
        for (let j = 0; j < this.teacherCourses[i].studentsArray.length; i++) {
          this.studentsInCourse.push(this.teacherCourses[i].studentsArray[j]);
        }
      }
    }
    this.showStudentsTableBoolean = true;
  }

  deleteUserFromCourse(student: string) {
    this.authService.deleteStudentFromCourse(student, this.selectedCourse).subscribe(response => {

    });
  }

  //

  ////material
  choseFile(event: any) {
    this.file = event.target.files[0];
  }
  addData() {
    const userId = this.courseMaterial.id;
    const storageRef = this.storage.ref(`CourseMaterial/${userId}`).child(this.file.name);
    const uploadTask = storageRef.put(this.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe((downloadURL) => {
          const encodedDownloadURL = encodeURIComponent(downloadURL);
          this.authService.updateAssignmentLink(encodedDownloadURL, userId).subscribe(() => {
            alert('Course Material updated successfully');
            window.location.reload();
          }, error => {
            alert('Error occurred during Course Material update');
          });
        });
      })
    ).subscribe();
  }


  onSubmit(): void {
    const userId = this.courseMaterial.id;
    const storageRef = this.storage.ref(`CourseMaterial/${userId}`).child(this.file.name);
    const uploadTask = storageRef.put(this.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe((downloadURL) => {
          const encodedDownloadURL = (downloadURL);
          this.courseMaterial.materialCourseLink = encodedDownloadURL;
          this.authService.addCourseMaterial(this.courseMaterial).subscribe(
            () => {
              alert('Course Material added successfully');
            },
            () => {
              alert('Course Material with this name already exists');
            }
          );
        });
      })
    ).subscribe();
  }


}
