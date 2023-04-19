import { api } from "../api/api";

export const saveStudent = async (user: any) => {
  return await api.post("/students", { ...user });
};

export const getStudentProfile = async () => {
  return (await api.get("/students/profile")).data as any;
  // const { password, ...res } = user;
  // return res;
};
