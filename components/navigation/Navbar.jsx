"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import users from "@/data/users"; // Impor data users.js
import Notification from "@/components/notification/Notification"; // Impor komponen notifikasi

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Ambil currentUser dari localStorage
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      const detailedUser = users.find((u) => u.id === storedUser.id);
      setUser(detailedUser || storedUser);
    }
  }, []);

  return (
    <div className="flex items-center justify-between bg-main text-white py-6 px-10 shadow-md">
      {/* User Info */}
      {user && (
        <div className="flex items-center gap-4">
          <Image
            src={user.photo || "/default-avatar.png"}
            alt="User Photo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-xs text-gray-300">{user.role}</p>
          </div>
        </div>
      )}

      {/* Notifications */}
      <Notification user={user} />
    </div>
  );
};

export default Navbar;
