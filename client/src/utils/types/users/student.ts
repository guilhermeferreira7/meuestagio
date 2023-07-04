export type Student = {
  name: string;
  email: string;
  institution: {
    name: string;
  };
  course: {
    name: string;
  };
  phone?: number;
  emailVerified: boolean;
  phoneVerified: boolean;
  userVerified: boolean;
  city: {
    id: number;
    name: string;
  };
};
