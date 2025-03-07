"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSettings, FiLogOut } from "react-icons/fi";

const SettingsDropdown = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className="text-white hover:text-gray-300 transition p-2"
        title="Pengaturan"
      >
        <FiSettings size={24} />
      </button>

      {isSettingsOpen && (
        <div className="absolute right-0 mt-4 w-52 bg-white text-black shadow-md rounded-md z-50">
          <button
            onClick={() => {
              setIsSettingsOpen(false);
              router.push("/dashboard/edit-profile");
            }}
            className="flex items-center gap-2 w-full px-4 py-4 hover:bg-gray-100 text-left"
          >
            <FiSettings size={18} />
            <span>Pengaturan Akun</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-4 hover:bg-gray-100 text-red-500 text-left"
          >
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;
