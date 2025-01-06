"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { AiOutlineSetting } from "react-icons/ai";
import { BiBarChart } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { MdDashboard, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { LuNotebookPen } from "react-icons/lu";

const Sidebar = () => {
  const pathname = usePathname();
  const [openSubMenu, setOpenSubMenu] = useState(false); // State untuk toggle submenu

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: MdDashboard },
    {
      name: "Post Management",
      icon: LuNotebookPen,
      children: [
        { name: "Tambah Artikel", href: "/dashboard/post-management/tambah-artikel" },
        { name: "Kelola Artikel", href: "/dashboard/post-management/kelola-artikel" },
      ],
    },
    { name: "Settings", href: "/dashboard/settings", icon: AiOutlineSetting },
    { name: "Reports", href: "/dashboard/reports", icon: BiBarChart },
  ];

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const isSubMenuActive = (children) => {
    return children.some((child) => pathname.startsWith(child.href));
  };

  return (
    <aside className="w-64 bg-main text-white h-screen flex flex-col relative">
      {/* Header Sidebar */}
      <div className="p-4 text-left border-b border-gray-700 flex items-center gap-4">
        <Image
          src="/Logo.png"
          alt="CoinZone Logo"
          width={150}
          height={150}
          className="rounded-md"
        />
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-1 p-4 relative">
        <ul className="space-y-4 relative text-[12px] list-outside">
          {navItems.map((item) => (
            <li key={item.name} className="relative">
              {/* Menu Utama dengan Submenu */}
              {item.children ? (
                <>
                  <div
                    onClick={() => setOpenSubMenu(!openSubMenu)}
                    className={`flex items-center justify-between gap-4 p-4 rounded-md cursor-pointer transition-all duration-300 ${
                      isSubMenuActive(item.children) || openSubMenu
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon size={20} />
                      <span>{item.name}</span>
                    </div>
                    {openSubMenu ? (
                      <MdKeyboardArrowUp size={20} />
                    ) : (
                      <MdKeyboardArrowDown size={20} />
                    )}
                  </div>

                  {/* Submenu dengan Jarak yang Lebih Jelas */}
                  <ul
                    className={`overflow-hidden transition-all duration-300 mt-2 ${
                      openSubMenu ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    {item.children.map((child) => (
                      <li key={child.name} className="mt-1">
                        <Link
                          href={child.href}
                          className={`block p-2 pl-8 rounded-md transition-all duration-300 ${
                            isActive(child.href)
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
                // Menu Tanpa Submenu
                <Link
                  href={item.href}
                  className={`flex items-center gap-4 p-4 rounded-md transition-all duration-300 ${
                    isActive(item.href)
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
          className="flex items-center gap-4 w-full text-left p-2 rounded-md hover:bg-red-600 transition-all duration-300"
        >
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
