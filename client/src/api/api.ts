import axios from "axios";

export type ApiErrorDetail = {
  name: string;
  message: string;
};

export type ApiError = {
  error: string;
  details?: ApiErrorDetail[];
};

export function isAPIError(data: unknown): data is ApiError {
  return (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof (data as ApiError).error === "string"
  );
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

instance.interceptors.request.use((request) => {
  if (window.__AccessToken__) {
    request.headers.Authorization = `Bearer ${window.__AccessToken__}`;
  }

  return request;
});

export default instance;
