"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlinePlus } from "react-icons/ai";
import { BiBarChart } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import {
  MdDashboard,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import { TbFileSettings } from "react-icons/tb";
import { LuNotebookPen } from "react-icons/lu";
import { PiSealPercent } from "react-icons/pi";
import { GrUserSettings } from "react-icons/gr";
import { draftArticles } from "@/data/draftArticlesData";
import { rolePermissions } from "@/data/rolePermissions";
import { pendingAdsData } from "@/data/pendingAdsData"; // ✅ Import data pending ads


const Sidebar = () => {
  const pathname = usePathname();
  const [openSubMenu, setOpenSubMenu] = useState({});
  const [userRole, setUserRole] = useState("Guest");

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

  const isSubMenuActive = (children) => {
    return children?.some((child) => pathname.startsWith(child.href));
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
        {
          name: "Kelola Artikel",
          href: "/dashboard/post-management/kelola-artikel",
        },
        {
          name: `Draft (${draftArticles.length})`,
          href: "/dashboard/post-management/draft",
        },
        { name: "Recycle Bin", href: "/dashboard/post-management/recyclebin" },
      ],
    },
    {
      name: "Content Management",
      icon: TbFileSettings,
      submenuKey: "content",
      feature: "content-management",
      children: [
        {
          name: "Headline Utama",
          href: "/dashboard/content-management/headline-utama",
        },
        {
          name: "Pilihan Editor",
          href: "/dashboard/content-management/pilihan-editor",
        },
        {
          name: "Berita Popular",
          href: "/dashboard/content-management/berita-populer",
        },
      ],
    },
   
    ...(userRole === "Master" ||
    userRole === "Super Admin" ||
    userRole === "Editor"
      ? [
          {
            name: "User Management",
            icon: GrUserSettings,
            submenuKey: "user",
            feature: "user-management",
            children: [
              {
                name: "All Artikel",
                href: "/dashboard/user-management/all-artikel",
              },
              {
                name: "Kelola User",
                href: "/dashboard/user-management/kelola-user",
              },
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
    <aside className="w-64 bg-main text-white h-screen flex flex-col relative">
      <div className="p-4 text-left border-b border-gray-700 mt-5">
        <Link
          href="/dashboard/buat-artikel"
          className="flex items-center gap-4 py-5 px-10 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
        >
          <AiOutlinePlus size={20} />
          <span className="text-sm font-bold">Buat Artikel</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 relative">
        <ul className="space-y-4 relative text-[12px] list-outside ">
          {navItems.map(
            (item) =>
              hasPermission(item.feature) && (
                <li key={item.name} className="relative">
                  {item.children ? (
                    <>
                      <div
                        onClick={() => toggleSubMenu(item.submenuKey)}
                        className={`flex items-center justify-between gap-2 p-4 rounded-md cursor-pointer transition-all duration-300 ${
                          isSubMenuActive(item.children)
                            ? "hover:bg-gray-700"
                            : "hover:bg-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <item.icon size={18} />
                          <span>{item.name}</span>
                        </div>
                        {openSubMenu[item.submenuKey] ? (
                          <MdKeyboardArrowUp size={20} />
                        ) : (
                          <MdKeyboardArrowDown size={20} />
                        )}
                      </div>

                      <ul
                        className={`overflow-hidden transition-all duration-300 mt-2 ml-4 ${
                          openSubMenu[item.submenuKey]
                            ? "max-h-60 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        {item.children.map((child) => (
                          <li key={child.name}>
                            <Link
                              href={child.href}
                              className={`block p-2 pl-8 rounded-md transition-all duration-300 ${
                                pathname.startsWith(child.href)
                                  ? "bg-blue-500 text-white"
                                  : "hover:bg-gray-700"
                              }`}
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 p-4 rounded-md transition-all duration-300 ${
                        pathname === item.href
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </li>
              )
          )}
        </ul>
      </nav>

      {/* <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="flex items-center gap-4 w-full text-left p-2 rounded-md hover:bg-red-600 transition-all duration-300"
        >
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
      </div> */}
    </aside>
  );
};

export default Sidebar;
