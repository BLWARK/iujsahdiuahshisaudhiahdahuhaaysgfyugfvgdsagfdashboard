"use client";
import { useState } from "react";
import { useBackend } from "@/context/BackContext";

export default function LoginForm() {
  const { login } = useBackend();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    // ✅ Validasi input sebelum hit API
    if (!email || !password) {
      setError("Email dan Password harus diisi!");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await login(email, password);
  
      if (!response?.token) {
        // ✅ Jika gagal dari response backend → tampilkan pesan dari backend atau default
        setError(response?.message || "Login gagal, periksa kembali email dan password!");
        setPassword(""); // Kosongkan hanya password
      }
    } catch (err) {
      // ✅ Tangkap error dari jaringan atau koneksi
      setError("Login gagal! Periksa koneksi internet atau coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded-md"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded-md"
      />
      <button
        type="submit"
        disabled={loading}
        className={`w-full ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white py-2 rounded-md`}
      >
        {loading ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}
