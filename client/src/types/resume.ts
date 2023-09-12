import { Student } from "./users/student";

export type Resume = {
  id: number;
  studentId: number;
  student: Student;
  title: string;
  about: string;
  skills: Skill[];
  educations: Education[];
  experiences: Experience[];
  languages: Language[];
  projects: Project[];
};

export type Project = {
  id: number;
  resumeId: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  currentProject: boolean;
};

export type Skill = {
  id: number;
  resumeId: number;
  name: string;
  level: SkillLevel;
};

export enum SkillLevel {
  Basic = "Básico",
  Intermediate = "Intermediário",
  Advanced = "Avançado",
}

export type Language = {
  id: number;
  resumeId: number;
  name: string;
  level: LanguageLevel;
};

export type Experience = {
  id: number;
  resumeId: number;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
  currentJob: boolean;
};

export type Education = {
  id: number;
  resumeId: number;
  school: string;
  degree: Degree;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
};

export enum Degree {
  HighSchool = "Ensino Médio",
  Technical = "Ensino Técnico",
  Undergraduate = "Ensino Superior",
  Postgraduate = "Pós-Graduação",
}

export enum LanguageLevel {
  Basic = "Básico",
  Intermediate = "Intermediário",
  Advanced = "Avançado",
  Fluent = "Fluente",
}
