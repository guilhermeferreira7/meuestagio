import { api } from "../../api/api";

export const saveStudent = async (user: any) => {
  return await api.post("/students", { ...user });
};
