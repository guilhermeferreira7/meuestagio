import axios from "axios";
import { IBGE_API_BASE_URL } from "../../constants/api";

export default axios.create({
  baseURL: IBGE_API_BASE_URL,
});
