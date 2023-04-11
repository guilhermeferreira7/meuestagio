import axios from "axios";

const axiosApi = axios.create({});

axios.defaults.baseURL = "http://localhost:3001";

export default axiosApi;
