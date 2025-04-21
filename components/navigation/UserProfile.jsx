"use client";
import React from "react";
import Image from "next/image";
import { useBackend } from "@/context/BackContext"; // ✅ Pakai useBackend

const UserProfile = () => {
  const { user } = useBackend(); // ✅ Ambil langsung dari context

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-16 h-16">
      <Image
        src={user.avatar || "/default.jpg"}
        alt="User Photo"
        fill
        className="rounded-full object-cover"
      />
      </div>
      <div>
        <p className="font-semibold">{user.username}</p> {/* ✅ Pakai username terbaru */}
        <p className="text-xs text-gray-300">Role: {user.role}</p> {/* ✅ Role dari backend */}
      </div>
    </div>
  );
};

export default UserProfile;
