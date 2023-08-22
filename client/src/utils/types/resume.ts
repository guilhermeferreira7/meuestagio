import { Student } from "./users/student";

export type Resume = {
  id: number;
  studentId: number;
  student: Student;
  title: string;
  about: string;
  skills: string;
  educations: Education[];
  experiences: Experience[];
  languages: string;
};

type Experience = {
  id: number;
  resumeId: number;
  company: string;
  jobTitle: string;
  description: string;
  startDate: string;
  endDate: string;
};

type Education = {
  id: number;
  resumeId: number;
  school: string;
  degree: Degree;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
};

enum Degree {
  HighSchool = "Ensino Médio",
  Technical = "Ensino Técnico",
  Undergraduate = "Ensino Superior",
  Postgraduate = "Pós-Graduação",
}
