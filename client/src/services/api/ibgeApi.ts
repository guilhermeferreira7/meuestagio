import axios from "axios";
import { IBGE_API_BASE_URL } from "app-constants";

export const ibgeApi = axios.create({
  baseURL: IBGE_API_BASE_URL,
});
