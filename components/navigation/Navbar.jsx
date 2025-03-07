"use client";
import React, { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import { useRouter } from "next/navigation";
import users from "@/data/users";
import Notification from "@/components/notification/Notification";
import UserProfile from "./UserProfile";
import PortalSelector from "./PortalSelector";
import SettingsDropdown from "./SettingsDropdown";
import Sidebar from "@/components/sidebar/Sidebar";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      const detailedUser = users.find((u) => u.id === storedUser.id);
      setUser(detailedUser || storedUser);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="flex items-center justify-between bg-main text-white h-[113px] 2xl:px-10 xl:px-10 lg:px-10 px-3 shadow-lg">
        <div className="flex justify-start items-start gap-4">
        {/* Hamburger Menu untuk membuka Sidebar */}
        <button onClick={toggleSidebar} className="2xl:hidden text-white p-2">
          <FiMenu size={30} />
        </button>
        <div className="2xl:block xl:block lg:block hidden">
        {/* User Info */}
        <UserProfile user={user} />
        </div>
        </div>
        <div className="flex items-center gap-2">
          <PortalSelector selectedPortal={selectedPortal} setSelectedPortal={setSelectedPortal} />
          <Notification user={user} />
          <SettingsDropdown />
        </div>
      </div>
      <div className="2xl:hidden xl:block lg:block">
      {/* Sidebar (Overlay untuk layar kecil, inline untuk xl ke atas) */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
    </>
  );
};

export default Navbar;
