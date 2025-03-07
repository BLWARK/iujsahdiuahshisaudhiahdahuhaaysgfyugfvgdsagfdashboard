"use client";
import Link from "next/link";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

const SidebarItem = ({ item, pathname, openSubMenu, toggleSubMenu, toggleSidebar }) => {
  const isActive = item.children
    ? item.children.some((child) => pathname.startsWith(child.href))
    : pathname === item.href;

  return (
    <li className="relative">
      {item.children ? (
        <>
          <div
            onClick={() => toggleSubMenu(item.submenuKey)}
            className={`flex items-center justify-between gap-2 p-4 rounded-md cursor-pointer transition-all duration-300 ${
              isActive ? "bg-gray-700" : "hover:bg-gray-700"
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
                  onClick={toggleSidebar} // **Sidebar tertutup setelah klik menu**
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
            isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
          }`}
          onClick={toggleSidebar} // **Sidebar tertutup setelah klik menu**
        >
          <item.icon size={20} />
          <span>{item.name}</span>
        </Link>
      )}
    </li>
  );
};

export default SidebarItem;
