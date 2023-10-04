export type UserAuth = {
  email: string;
  name: string;
  role: Role;
  avatarURL?: string;
  sub: string;
};

export enum Role {
  Student = "student",
  Professor = "professor",
  Company = "company",
  Admin = "admin",
}
