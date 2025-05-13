"use client";
import React, { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import { useRouter } from "next/navigation";
import users from "@/data/users";
// import Notification from "@/components/notification/Notification";
import UserProfile from "./UserProfile";
import PortalSelector from "./PortalSelector";
import SettingsDropdown from "./SettingsDropdown";
import Sidebar from "@/components/sidebar/Sidebar";
import { loadCategoriesByPortal } from "@/utils/portalCategories"; // ✅ Import kategori

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      const detailedUser = users.find((u) => u.id === storedUser.id);
      setUser(detailedUser || storedUser);
    }

    const storedPortal = JSON.parse(localStorage.getItem("selectedPortal"));
    if (storedPortal) {
      setSelectedPortal(storedPortal);
      setCategories(loadCategoriesByPortal(storedPortal.id)); // ✅ Load kategori awal
    }
  }, []);

  const handlePortalChange = (portal) => {
    setSelectedPortal(portal);
    setCategories(loadCategoriesByPortal(portal.id)); // ✅ Update kategori sesuai portal yang dipilih
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="flex items-center justify-between bg-gray-700 text-white h-[113px] 2xl:px-10 xl:px-10 lg:px-10 px-3 shadow-lg">
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
          {/* ✅ Tambahkan `onPortalChange` */}
          <PortalSelector
            selectedPortal={selectedPortal}
            setSelectedPortal={setSelectedPortal}
            onPortalChange={handlePortalChange}
          />
          {/* <Notification user={user} /> */}
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
