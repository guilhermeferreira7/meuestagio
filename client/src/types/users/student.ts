import { UserAuth } from "../auth/user-auth";
import { City } from "../city";
import { Course } from "../course";
import { Institution } from "../institution";
import { Resume } from "../resume";

export type Student = {
  id: number;
  name: string;
  email: string;
  phone?: number;
  about?: string;
  institution: Institution;
  course: Course;
  emailVerified: boolean;
  phoneVerified: boolean;
  city: City;
  resume: Resume;
  resumeId: number;
  imageUrl?: string;
};

export type StudentPatch = {
  access_token: string;
  user: UserAuth;
  student: Student;
};
