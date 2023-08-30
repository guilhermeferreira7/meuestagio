import { Resume } from "./resume";
import { Student } from "./users/student";
import { Vacancy } from "./vacancy";

export type JobApplication = {
  id: number;

  studentId: number;
  student: Student;

  resumeId: number;
  resume: Resume;

  vacancyId: number;
  vacancy: Vacancy;
};
