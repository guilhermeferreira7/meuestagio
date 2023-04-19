import axios from "axios";
import { parseCookies } from "nookies";
import { API_BASE_URL } from "../constants";

export function getAPIClient(ctx?: any) {
  const { ["next.token"]: token } = parseCookies(ctx);
  console.log("token ", token);

  const api = axios.create({
    baseURL: API_BASE_URL,
  });

  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return api;
}

// use this in server
