export class Course {
  course_capacity: string;
  course_credits: string ;
  course_description: string;
  course_duration: string;
  course_id: string;
  course_name: string;
  course_start_date: string;
  course_teacher: string;
  students_array :string [];


  constructor(course_capacity: string, course_credits: string, course_description: string, course_duration: string
    ,course_id: string,course_name: string,course_start_date: string,course_teacher: string,students_array: string []) {
    this.course_capacity = course_capacity;
    this.course_credits = course_credits;
    this.course_description = course_description;
    this.course_duration = course_duration;
    this.course_id = course_id;
    this.course_name = course_name;
    this.course_start_date = course_start_date;
    this.course_teacher = course_teacher;
    this.students_array = students_array;
  }
}

