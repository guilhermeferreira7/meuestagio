export type UserAuth = {
  email: string;
  password: string;
  role: Role;
};

export enum Role {
  Student = "student",
  Professor = "professor",
  Company = "company",
  Admin = "admin",
}
