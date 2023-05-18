export interface ForgotPasswordResponse {
  message: string;
  verificationLink: string;
}
export interface CourseMaterial {
  id?: any;
  materialCourseLink: any;
  materialCourseId: any;
  materialCourseName: any;
  materialCourseDescription: any;
}
export interface LoginRequest {
  email: string;
  password: string;
}
export interface Submission {
  submission_id?: string;
  submission_description: string;
  submission_assignment_id: string;
  submission_student_id: string;
  answerURL?: string;
}
export interface Assignment {
  assignment_id?: any;
  name: any;
  description: any;
  course_id: any;
  material_link: any;
  deadline: any;
  studentUploads: any[];
}
export interface Course {
  id?: string;
  capacity: number;
  credits: number;
  description: string;
  semesterHours: number;
  name: string;
  teacherID: string;
  studentsArray: string[];
  semester: string;
  major: string;
}
export interface User {
  id?: string;
  firstname: string;
  lastname: string;
  birthday: Date;
  email: string;
  password: string;
  role: string;
  major: string;
  image?: string; // add a new property called "image"
}
export interface AuthResponse {
  token: string;
  user: User;
}

export interface SundaySchedule {
  id?: string;
  teacherId: string;
  scheduleMajor: string;
  sundayArray: string[];

}


interface CourseSchudle {
  courseName: string;
  courseHours: number;
}


export interface PublicSchedule {
  id?: string;
  majorName: string;
  sunday: CourseSchudle[];
  monday: CourseSchudle[];
  tuesday: CourseSchudle[];
  wednesday: CourseSchudle[];
  thursday: CourseSchudle[];
  friday: CourseSchudle[];
}
export interface Major {
  id?: string;
  majorName: string;
  isBeingEdited: boolean;
  coursesList: string[];
  schedule: {
    sunday: CourseInsideMajor[];
    monday: CourseInsideMajor[];
    tuesday: CourseInsideMajor[];
    wednesday: CourseInsideMajor[];
    thursday: CourseInsideMajor[];
    friday: CourseInsideMajor[];
  };
}

export interface CourseInsideMajor {
  courseId: string;
  timeSlot: string;
}


