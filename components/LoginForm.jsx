"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import users from "@/data/users";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validasi Input Kosong
    if (!email || !password) {
      setError("Email and Password are required!");
      return;
    }

    // Validasi Format Email
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format!");
      return;
    }

    setLoading(true);

    // Cek Data Dummy
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      console.log("Login Successful:", user);
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: user.id,
          name: user.name,
          role: user.role,
        })
      );

      // Arahkan ke halaman pilih portal
      router.push("/select-portal");
    } else {
      setError("Invalid email or password!");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        } text-white py-2 rounded-md`}
      >
        {loading ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}
