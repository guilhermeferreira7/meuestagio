import { api } from "../api/api";

export const getJobs = async () => {
  return (await api.get("/jobs")).data;
};
