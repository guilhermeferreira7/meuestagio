import { api } from "../api/api";

export const getVacancies = async () => {
  return (await api.get("/vacancies")).data;
};
