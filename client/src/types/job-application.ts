import { Resume } from "./resume";
import { Student } from "./users/student";
import { Job } from "./job";

export type JobApplication = {
  id: number;

  studentId: number;
  student: Student;

  status: JobApplicationStatus;

  resumeId: number;
  resume: Resume;

  message: string;

  jobId: number;
  job: Job;
};

export enum JobApplicationStatus {
  IN_PROGRESS = "Em andamento",
  INTERVIEW = "Entrevista",
  FINISHED = "Finalizado",
}
