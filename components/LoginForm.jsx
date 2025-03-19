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

    if (!email || !password) {
      setError("Email dan Password harus diisi!");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError("Login gagal, periksa kembali email dan password!");
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
