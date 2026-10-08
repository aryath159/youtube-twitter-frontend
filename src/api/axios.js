// Axios is a popular JavaScript library used to send
// HTTP requests (like GET, POST, PUT, DELETE) from a browser to a backend server.

import axios from "axios";

// the Vite dev server proxies "/api" to the Express backend (see vite.config.js)
const api_base_url = "/api/v1";

// axios.create creates the axios client
const api = axios.create({
  baseURL: api_base_url, // Prepended to every request URL
  withCredentials: true, // sends the httpOnly login cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});

// Cookie-based JWT:
// withCredentials -> browser sends the accessToken cookie -> verifyJWT reads it.
// js can't read httpOnly cookies, so there is no request interceptor here.

// urls where a 401 simply means "wrong credentials" - never try to refresh for these
const NO_REFRESH_URLS = [
  "/users/login",
  "/users/register",
  "/users/refresh-token",
];

// if several requests fail at the same moment they must share ONE refresh call,
// because the backend rotates the refresh token (a second call with the old token fails)
let refreshPromise = null;

// "Whenever api receives a response, run this code first."
api.interceptors.response.use(
  // 2xx response: nothing to do, let it pass
  (response) => response,

  // error response
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry || // avoid an infinite loop
      NO_REFRESH_URLS.some((url) => originalRequest.url?.includes(url))
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = api.post("/users/refresh-token").finally(() => {
          refreshPromise = null;
        });
      }

      // the backend sets new cookies...
      await refreshPromise;

      // ...so we can retry the original request
      return api(originalRequest);
    } catch {
      // refresh token invalid / expired -> the user really is logged out
      return Promise.reject(error);
    }
  }
);

export default api;
