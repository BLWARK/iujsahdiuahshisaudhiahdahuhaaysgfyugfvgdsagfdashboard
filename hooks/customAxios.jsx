"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

// ✅ Ambil token dari localStorage
const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

// ✅ Buat instance Axios dengan konfigurasi default
const customAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Pastikan ENV sudah diatur di file .env.local
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * ✅ Interceptor Request:
 * - Tambahkan token ke header Authorization jika tersedia
 */
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

/**
 * ✅ Interceptor Response:
 * - Tangani error secara global → Jangan tampilkan di console jika production
 * - Jika error berisi data dari backend, tampilkan ke UI
 */
customAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ Abaikan semua error dari backend tanpa menampilkan apapun
    return Promise.reject(error);
  }
);




/**
 * ✅ Fungsi HTTP GET
 * - Tangani kesalahan langsung dari axios instance
 * - Kembalikan `res.data` supaya mudah dipakai di komponen
 */
export async function customGet(endpoint, options = {}) {
  try {
    const res = await customAxios.get(endpoint, options);
    return res.data;
  } catch (error) {
    throw error;
  }
}

/**
 * ✅ Fungsi HTTP POST
 * - Tangani kesalahan langsung dari axios instance
 * - Kembalikan `res.data` supaya mudah dipakai di komponen
 */
export async function customPost(endpoint, data = {}, options = {}) {
  try {
    const res = await customAxios.post(endpoint, data, options);
    return res.data;
  } catch (error) {
    throw error;
  }
}

/**
 * ✅ Fungsi HTTP PUT
 * - Tangani kesalahan langsung dari axios instance
 * - Kembalikan `res.data` supaya mudah dipakai di komponen
 */
export async function customPut(endpoint, data = {}, options = {}) {
  try {
    const res = await customAxios.put(endpoint, data, options);
    return res.data;
  } catch (error) {
    throw error;
  }
}

/**
 * ✅ Fungsi HTTP PATCH
 * - Tangani kesalahan langsung dari axios instance
 * - Kembalikan `res.data` supaya mudah dipakai di komponen
 */
export async function customPatch(endpoint, data = {}, options = {}) {
  try {
    const res = await customAxios.patch(endpoint, data, options);
    return res.data;
  } catch (error) {
    throw error;
  }
}

/**
 * ✅ Fungsi Logout:
 * - Hapus token dari localStorage
 * - Arahkan user ke halaman login
 * - Gunakan useRouter untuk redirect
 */
export function useLogout() {
  const router = useRouter();

  return () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
    }
    router.push("/login");
  };
}

export default customAxios;
