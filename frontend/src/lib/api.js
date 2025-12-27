import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "https://real-estate-app-ntq2.onrender.com";

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 20000,
});

export function setAuthToken(token) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

export function getFileUrl(path, isDownload = false) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) {
    if (isDownload && path.includes("cloudinary.com")) {
      return path.replace("/upload/", "/upload/fl_attachment/");
    }
    return path;
  }
  return `${API_BASE}${path}`;
}

export { API_BASE };
