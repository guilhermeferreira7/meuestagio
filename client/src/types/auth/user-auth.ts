export type UserAuth = {
  email: string;
  name: string;
  password: string;
  role: Role;
  avatarURL?: string;
};

export enum Role {
  Student = "student",
  Professor = "professor",
  Company = "company",
  Admin = "admin",
}
