export interface Course {
  course_id?: string;
  course_name: string;
  course_description: string;
  course_teacher: string;
  course_start_date: string;
  course_duration: string;
  course_credits: string;
  course_capacity: string;
  students_array?: string[];
}
