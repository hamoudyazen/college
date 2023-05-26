import { Injectable } from '@angular/core';
import { User, Course, Major } from '../models/allModels';
import { AuthService } from './AuthService';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
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

    constructor(private authService: AuthService) {
        this.currentEmail = localStorage.getItem('email');
        this.initUserDetails();

        const date = new Date();
        const month = date.getMonth() + 1;

        if (month >= 10 || month < 4) {
            this.semester = 'winter';
        } else {
            this.semester = 'summer';
        }
    }

    private async initUserDetails(): Promise<void> {
        try {
            const response = await this.getUserDetails();
            this.userDetails = response;
            localStorage.setItem('userDetails', JSON.stringify(this.userDetails));
            this.major = this.userDetails[0].major;
            this.id = this.userDetails[0].id;
            this.firstname = this.userDetails[0].firstname;
            this.lastname = this.userDetails[0].lastname;
            this.email = this.userDetails[0].email;
            this.role = this.userDetails[0].role;
            this.profileImg = this.userDetails[0].image;
            this.name = this.userDetails[0].firstname + ' ' + this.userDetails[0].lastname;
        } catch (error) {
            console.error('Error retrieving user details:', error);
        }
    }



    getUserDetails(): Promise<User[]> {
        return new Promise<User[]>((resolve, reject) => {
            this.authService.getUserDetails(this.currentEmail).subscribe(
                response => {
                    resolve(response);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    getTeacherCourses(): Promise<Course[]> {
        return new Promise<Course[]>((resolve, reject) => {
            this.authService.getTeacherCourses(this.id).subscribe(
                response => {
                    resolve(response);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    getMajorCourses(): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this.authService.getMajorCourses(this.major).subscribe(
                response => {
                    resolve(response);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    getStudentCourses(): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this.authService.getUserCourses(this.email).subscribe(
                response => {
                    resolve(response);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    getMajorDetails(): Promise<Major[]> {
        return new Promise<any[]>((resolve, reject) => {
            this.authService.getMajorDetails(this.major).subscribe(
                response => {
                    resolve(response);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    getCourseTeacher(userRegisteredCourses: any[]): Promise<any[]> {
        const promises = userRegisteredCourses.map(course => {
            return new Promise<any>((resolve, reject) => {
                this.authService.getCourseDetails(course).subscribe(
                    response => {
                        resolve(response[0].teacherID);
                    },
                    error => {
                        reject(error);
                    }
                );
            });
        });

        return Promise.all(promises);
    }



    getAllCourseTeachers(): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this.authService.getAllCourses().subscribe(
                response => {
                    resolve(response);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    getAllUsers(): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this.authService.getAllUsers().subscribe(
                response => {
                    resolve(response);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    createMajor(major: Major): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this.authService.createMajor(major).subscribe(
                response => {
                    resolve(response);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    getTeacherAssignmentsSubmissions(id: string): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this.authService.teacherAssignmentsSubmissions(id).subscribe(
                response => {
                    resolve(response);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

}