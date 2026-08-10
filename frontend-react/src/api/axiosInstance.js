import axios from "axios";
import { store } from "../redux/store/store";
import { logout, updateAccessToken } from "../redux/slice/authSlice";
import { BACKEND_BASE_URL, DEV_MODE } from "../utils/constants";

// Axios instance
const api = axios.create({
  baseURL: BACKEND_BASE_URL,
  withCredentials: true,
});

if (DEV_MODE) {
  // if DEV_MODE = true;  true-> turning off frontend security... in dev mode it will off interceptors and headers
  console.warn("⚠️ DEV MODE ENABLED: No auth, no interceptors");

  // No interceptors → direct API calls
} else {
  // PRODUCTION MODE

  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
      error ? prom.reject(error) : prom.resolve(token);
    });
    failedQueue = [];
  };

  // Request Interceptor (attach access token)
  api.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response Interceptor (handle 401 + refresh token)
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      const isAuthEndpoint = originalRequest.url?.startsWith("/api/auth/");

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !isAuthEndpoint
      ) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((newToken) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        try {
          // Refresh token API (cookie-based)
          const { data } = await axios.post(
            `${BACKEND_BASE_URL}/api/auth/refresh-token`,
            {},
            { withCredentials: true },
          );

          const newAccessToken = data.accessToken;

          // Update Redux
          store.dispatch(updateAccessToken(newAccessToken));

          processQueue(null, newAccessToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed", refreshError);

          processQueue(refreshError, null);
          store.dispatch(logout());

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );
}

export default api;
