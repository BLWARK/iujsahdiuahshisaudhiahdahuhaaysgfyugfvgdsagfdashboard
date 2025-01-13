"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import users from "@/data/users";
import portals from "@/data/portals";
import Notification from "@/components/notification/Notification";
import { IoMdArrowDropdown } from "react-icons/io";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const storedPortal = JSON.parse(localStorage.getItem("selectedPortal"));

    if (storedUser) {
      const detailedUser = users.find((u) => u.id === storedUser.id);
      setUser(detailedUser || storedUser);
    }

    if (storedPortal) {
      setSelectedPortal(storedPortal);
    }
  }, []);

  const handleSelectPortal = (portal) => {
    localStorage.setItem("selectedPortal", JSON.stringify(portal));
    setSelectedPortal(portal);
    setIsDropdownOpen(false);
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-between bg-main text-white h-[113px] px-10 shadow-lg">
      {/* User Info */}
      {user && (
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
            <p className="text-xs text-gray-300">Role : {user.role}</p>
          </div>
        </div>
      )}

      {/* Bagian Kanan */}
      <div className="flex items-center gap-2">
        {/* Portal Selector */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-white text-main px-4 py-2 rounded-md hover:bg-gray-100 transition"
          >
            {selectedPortal ? (
              <>
                <Image
                  src={selectedPortal.logo}
                  alt={selectedPortal.name}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <span>{selectedPortal.name}</span>
              </>
            ) : (
              <span>Pilih Portal</span>
            )}
            <IoMdArrowDropdown size={20} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white text-black shadow-md font-semibold rounded-md z-50">
              {portals.map((portal) => (
                <button
                  key={portal.name}
                  onClick={() => handleSelectPortal(portal)}
                  className={`flex items-center gap-2 px-4 py-3 w-full text-left hover:bg-gray-100 rounded-md ${
                    selectedPortal?.name === portal.name
                      ? "bg-gray-200 font-semibold"
                      : ""
                  }`}
                >
                  <Image
                    src={portal.logo}
                    alt={portal.name}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  {portal.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <Notification user={user} />

        {/* 🔧 Settings Button */}
        <div className="relative">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="text-white hover:text-gray-300 transition p-2"
            title="Pengaturan"
          >
            <FiSettings size={24} />
          </button>

          {/* Dropdown Settings */}
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
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
                className="flex items-center gap-2 w-full px-4 py-4 hover:bg-gray-100 text-red-500 text-left"
              >
                <FiLogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
