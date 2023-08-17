export type Resume = {
  id: number;
  userName: string;
  address: string;
  email: string;
  phone: string;
  institution: string;
  course: string;
  title: string;
  about: string;
  skills: string;
  experiences: Experience[];
  educations: string;
  languages: string;
};

export type Experience = {
  id: number;
  resumeId: number;
  company: string;
  jobTitle: string;
  description: string;
  startDate: string;
  endDate: string;
};
