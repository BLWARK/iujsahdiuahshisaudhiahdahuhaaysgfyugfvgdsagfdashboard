"use client";
import React from "react";
import Image from "next/image";

const UserProfile = ({ user }) => {
  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <Image
        src={user.photo || "/default-avatar.png"}
        alt="User Photo"
        width={50}
        height={50}
        className="rounded-full object-cover"
      />
      <div>
        <p className="font-semibold">{user.name}</p>
        <p className="text-xs text-gray-300">Role: {user.role}</p>
      </div>
    </div>
  );
};

export default UserProfile;
