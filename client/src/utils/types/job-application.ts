import { Resume } from "./resume";
import { Student } from "./users/student";
import { Job } from "./job";

export type JobApplication = {
  id: number;

  studentId: number;
  student: Student;

  resumeId: number;
  resume: Resume;

  jobId: number;
  job: Job;
};
