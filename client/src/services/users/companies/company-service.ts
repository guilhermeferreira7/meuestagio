import { api } from "../../api/api";

export const saveCompany = async (user: any) => {
  return await api.post("/companies", { ...user });
};
