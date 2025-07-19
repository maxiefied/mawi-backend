// src/api.js
import axios from "axios";
import { auth } from "./firebase";

const API = axios.create({
  baseURL: "https://mawi-backend.onrender.com/api", // ✅ Your live backend
});

// Add Firebase ID token to every request if user is logged in
API.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`; // 👈 Add token to header
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;