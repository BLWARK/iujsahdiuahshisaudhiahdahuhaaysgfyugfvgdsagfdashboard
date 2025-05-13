"use client";
import { useState } from "react";
import { useBackend } from "@/context/BackContext";
import Swal from "sweetalert2";

export default function LoginForm() {
  const { login } = useBackend();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    if (!email || !password) {
      Swal.fire("❗Oops", "Email dan password wajib diisi!", "warning");
      return;
    }
  
    setLoading(true);
  
    try {
      const result = await login(email, password);
  
      if (!result.success) {
        Swal.fire("❌ Gagal Login", result.message || "Login gagal!", "error");
        setPassword("");
      } else {
        setIsRedirecting(true); // ⬅️ Tampilkan spinner
      }
    } catch (err) {
      Swal.fire("❌ Error", "Login gagal silahkan cek Password dan Email", "error");
    } finally {
      setLoading(false);
    }
  };
  {isRedirecting && (
    <div className="spinner-overlay">
      <div className="spinner"></div>
    </div>
  )}
  

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
        className={`w-full ${
          loading ? "bg-gray-400" : "bg-pink-500 hover:bg-pink-700"
        } text-white py-2 rounded-md`}
      >
        {loading ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}
