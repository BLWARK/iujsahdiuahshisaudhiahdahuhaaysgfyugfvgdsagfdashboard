"use client";
import axios from "axios";

const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("token") : null);

const customAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

// ✅ Interceptor untuk menyisipkan token
customAxios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor untuk menangani error global
customAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export async function customGet(endpoint, options = {}) {
  try {
    const res = await customAxios.get(endpoint, options);
    return res.data;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error;
  }
}

export async function customPost(endpoint, data = {}, options = {}) {
  try {
    const res = await customAxios.post(endpoint, data, options);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function customPut(endpoint, data = {}, options = {}) {
  try {
    const res = await customAxios.put(endpoint, data, options);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function customPatch(endpoint, data = {}, options = {}) {
  try {
    const res = await customAxios.patch(endpoint, data, options);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// ✅ Fungsi Logout menggunakan Next.js Router
import { useRouter } from "next/navigation";

export function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
  }
  const router = useRouter();
  router.push("/login");
}

export default customAxios;
