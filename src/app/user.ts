export interface User {
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
  major: string;
  image?: string; // add a new property called "image"
}
