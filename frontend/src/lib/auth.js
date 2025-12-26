import { setAuthToken } from "./api";

const KEY = "realstate_admin_token";

export function getToken() {
  return localStorage.getItem(KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(KEY, token);
  else localStorage.removeItem(KEY);
  setAuthToken(token);
}

export function initAuth() {
  setAuthToken(getToken());
}
