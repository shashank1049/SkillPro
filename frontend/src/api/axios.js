import axios from "axios";

const api = axios.create({
  baseURL: "https://hirepro-6yde.onrender.com/api/v1",
  withCredentials: true,
});

export default api;