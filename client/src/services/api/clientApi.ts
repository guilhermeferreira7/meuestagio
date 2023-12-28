import axios, { AxiosInstance } from "axios";
import { parseCookies } from "nookies";
import { API_BASE_URL_CLIENT, API_BASE_URL_SERVER } from "../../constants/api";

export function getAPIClient(ctx?: any) {
  const { "meuestagio.token": token } = parseCookies(ctx);

  let api: AxiosInstance = axios.create({});
  if (process.env.NODE_ENV === "production") {
    if (ctx) {
      api = axios.create({
        baseURL: API_BASE_URL_SERVER,
      });
    } else {
      api = axios.create({
        baseURL: API_BASE_URL_CLIENT,
      });
    }
  } else {
    api = axios.create({
      baseURL: API_BASE_URL_CLIENT,
    });
  }

  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return api;
}

// use this in server
