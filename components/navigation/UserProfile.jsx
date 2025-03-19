"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ Ambil user dari localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  if (!user) return null; // Jika belum ada user, jangan tampilkan apapun

  return (
    <div className="flex items-center gap-4">
      <Image
        src={user.photo || "/default.jpg" } // Gunakan foto jika ada
        alt="User Photo"
        width={50}
        height={50}
        className="rounded-full object-cover"
      />
      <div>
        <p className="font-semibold">{user.fullname || user.username}</p> {/* Ambil fullname, jika kosong pakai username */}
        <p className="text-xs text-gray-300">Role: {user.role}</p> {/* Role dari backend */}
      </div>
    </div>
  );
};

export default UserProfile;
