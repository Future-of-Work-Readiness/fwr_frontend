import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - attach auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage (Zustand persists here)
    if (typeof window !== "undefined") {
      try {
        const authStorage = localStorage.getItem("fwr-auth-storage");
        if (authStorage) {
          const { state } = JSON.parse(authStorage);
          const token = state?.accessToken;
          
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (error) {
        console.error("Error reading auth token:", error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common error scenarios
    if (error.response) {
      const status = error.response.status;
      
      switch (status) {
        case 401:
          // Unauthorized - clear auth state and redirect to login
          if (typeof window !== "undefined") {
            localStorage.removeItem("fwr-auth-storage");
            localStorage.removeItem("fwr-career-storage");
            
            // Only redirect if not already on auth page
            if (!window.location.pathname.startsWith("/auth")) {
              window.location.href = "/auth";
            }
          }
          break;
          
        case 403:
          // Forbidden
          console.error("Access forbidden:", error.response.data);
          break;
          
        case 404:
          // Not found
          console.error("Resource not found:", error.config?.url);
          break;
          
        case 422:
          // Validation error
          console.error("Validation error:", error.response.data);
          break;
          
        case 500:
        case 502:
        case 503:
          // Server errors
          console.error("Server error:", error.response.data);
          break;
          
        default:
          console.error("API error:", error.response.data);
      }
    } else if (error.request) {
      // Network error
      console.error("Network error - no response received");
    } else {
      // Request setup error
      console.error("Request error:", error.message);
    }
    
    return Promise.reject(error);
  }
);

// Export the configured instance
export default api;

// Export helper functions for common request patterns
export const apiGet = <T>(url: string, config?: Parameters<typeof api.get>[1]) =>
  api.get<T>(url, config).then((res) => res.data);

export const apiPost = <T>(url: string, data?: unknown, config?: Parameters<typeof api.post>[2]) =>
  api.post<T>(url, data, config).then((res) => res.data);

export const apiPut = <T>(url: string, data?: unknown, config?: Parameters<typeof api.put>[2]) =>
  api.put<T>(url, data, config).then((res) => res.data);

export const apiPatch = <T>(url: string, data?: unknown, config?: Parameters<typeof api.patch>[2]) =>
  api.patch<T>(url, data, config).then((res) => res.data);

export const apiDelete = <T>(url: string, config?: Parameters<typeof api.delete>[1]) =>
  api.delete<T>(url, config).then((res) => res.data);

