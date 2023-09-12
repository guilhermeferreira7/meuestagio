import { Resume } from "../resume";

export type Student = {
  id: number;
  name: string;
  about?: string;
  email: string;
  institution: {
    id: number;
    name: string;
  };
  course: {
    id: number;
    name: string;
  };
  phone?: number;
  emailVerified: boolean;
  phoneVerified: boolean;
  userVerified: boolean;
  city: {
    id: number;
    name: string;
    state: string;
  };
  resume: Resume;
};
