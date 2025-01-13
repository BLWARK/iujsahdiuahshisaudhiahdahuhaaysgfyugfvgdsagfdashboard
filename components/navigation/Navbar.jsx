"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import users from "@/data/users";
import portals from "@/data/portals"; // ✅ Import data portal
import Notification from "@/components/notification/Notification";
import { IoMdArrowDropdown } from "react-icons/io";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    window.location.reload(); // Refresh halaman setelah ganti portal
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
            className="rounded-full"
          />
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-xs text-gray-300">Role : {user.role}</p>
          </div>
        </div>
      )}

      {/* Bagian Kanan */}
      <div className="flex items-center gap-6">
       

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

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-[250px] bg-white text-black shadow-md rounded-md z-50">
              {portals.map((portal) => (
                <button
                  key={portal.name}
                  onClick={() => handleSelectPortal(portal)}
                  className={`flex items-center gap-2 px-4 py-4 w-full text-left hover:bg-gray-100 rounded-xl ${
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
      </div>
    </div>
  );
};

export default Navbar;
