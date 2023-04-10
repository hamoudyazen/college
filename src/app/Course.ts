export interface Course {
  id?: string;
  capacity: number;
  credits: number;
  description: string;
  duration: number;
  name: string;
  teacherID: string;
  studentsArray: string[];
  semester: string;
}
