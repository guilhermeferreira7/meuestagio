import axios from "axios";
import { parseCookies } from "nookies";
import { API_BASE_URL } from "../../constants/api";

export function getAPIClient(ctx?: any) {
  const { "meuestagio.token": token } = parseCookies(ctx);

  const api = axios.create({
    baseURL: API_BASE_URL,
  });

  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return api;
}

// use this in server
