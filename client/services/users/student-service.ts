import axios from "axios";
import { API_BASE_URL } from "../constants";

export const saveStudent = async (user: any) => {
  // TO-DO fix this (baseURL not working here)
  return await axios.post("/students", { ...user }, { baseURL: API_BASE_URL });
};
