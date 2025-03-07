"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlinePlus } from "react-icons/ai";
import { BiBarChart } from "react-icons/bi";
import { MdDashboard } from "react-icons/md";
import { TbFileSettings } from "react-icons/tb";
import { LuNotebookPen } from "react-icons/lu";
import { PiSealPercent } from "react-icons/pi";
import { GrUserSettings } from "react-icons/gr";
import { draftArticles } from "@/data/draftArticlesData";
import { rolePermissions } from "@/data/rolePermissions";
import { pendingAdsData } from "@/data/pendingAdsData";
import SidebarSubMenu from "./SidebarSubMenu";
import UserProfile from "../navigation/UserProfile";
import users from "@/data/users";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const [openSubMenu, setOpenSubMenu] = useState({});
  const [userRole, setUserRole] = useState("Guest");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      const detailedUser = users.find((u) => u.id === storedUser.id);
      setUser(detailedUser || storedUser);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserRole(parsedUser?.role || "Guest");
      } else {
        setUserRole("Guest");
      }
    }
  }, []);

  const toggleSubMenu = (key) => {
    setOpenSubMenu((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const hasPermission = (feature) => {
    const permissions = rolePermissions[userRole];
    return permissions?.includes(feature);
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: MdDashboard,
      feature: "dashboard",
    },
    {
      name: "Post Management",
      icon: LuNotebookPen,
      submenuKey: "post",
      feature: "post-management",
      children: [
        { name: "Kelola Artikel", href: "/dashboard/post-management/kelola-artikel" },
        { name: `Draft (${draftArticles.length})`, href: "/dashboard/post-management/draft" },
        { name: "Recycle Bin", href: "/dashboard/post-management/recyclebin" },
      ],
    },
    {
      name: "Content Management",
      icon: TbFileSettings,
      submenuKey: "content",
      feature: "content-management",
      children: [
        { name: "Headline Utama", href: "/dashboard/content-management/headline-utama" },
        { name: "Pilihan Editor", href: "/dashboard/content-management/pilihan-editor" },
        { name: "Berita Popular", href: "/dashboard/content-management/berita-populer" },
      ],
    },
    ...(userRole === "Master" || userRole === "Super Admin" || userRole === "Editor"
      ? [
          {
            name: "User Management",
            icon: GrUserSettings,
            submenuKey: "user",
            feature: "user-management",
            children: [
              { name: "All Artikel", href: "/dashboard/user-management/all-artikel" },
              { name: "Kelola User", href: "/dashboard/user-management/kelola-user" },
              { name: "Analytic", href: "/dashboard/user-management/analytic" },
            ],
          },
          {
            name: "Marketing",
            icon: PiSealPercent,
            submenuKey: "marketing",
            feature: "marketing",
            children: [
              { name: "Advertising", href: "/dashboard/marketing/advertising" },
              { name: "Press Release", href: "/dashboard/marketing/press-release" },
              { name: "Event", href: "/dashboard/marketing/event" },
              {
                name: `Pending Ads (${pendingAdsData.filter((ad) => ad.status === "Pending").length})`,
                href: "/dashboard/marketing/pending-ads",
              },
            ],
          },
        ]
      : []),
    {
      name: "Reports",
      href: "/dashboard/reports",
      icon: BiBarChart,
      feature: "reports",
    },
  ];

  return (
    <aside
      className={`bg-main text-white w-64 h-full 2xl:relative shadow-lg z-50 overflow-y-auto ${
        isOpen
          ? "fixed inset-y-0 left-0 transform translate-x-0 transition-transform duration-300 ease-in-out"
          : "fixed inset-y-0 left-0 transform -translate-x-full transition-transform duration-300 ease-in-out 2xl:block 2xl:translate-x-0  "
      }`}
    >
      {/* Tombol Close untuk layar kecil */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 text-white 2xl:hidden text-lg"
      >
        ✖
      </button>
    
      <div className="p-4 text-left border-b border-gray-700 2xl:mt-5 xl:mt-10 lg:mt-10 mt-0">
        <div className="2xl:py-0 xl:py-0 lg:py-0 py-5 2xl:hidden xl:hidden lg:hidden block">
      <UserProfile user={user}/>
      </div>
        <Link
          href="/dashboard/buat-artikel"
          className="flex items-center gap-4 py-5 px-10 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
        >
          <AiOutlinePlus size={20} />
          <span className="text-sm font-bold">Buat Artikel</span>
        </Link>
      </div>

      <nav className="p-4">
        <SidebarSubMenu
          items={navItems}
          pathname={pathname}
          openSubMenu={openSubMenu}
          toggleSubMenu={toggleSubMenu}
          hasPermission={hasPermission}
          toggleSidebar={toggleSidebar} // **Tambahkan toggleSidebar**
        />
      </nav>
    </aside>
  );
};

export default Sidebar;
