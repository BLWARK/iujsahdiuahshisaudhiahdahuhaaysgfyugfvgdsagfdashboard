"use client";
import SidebarItem from "./SidebarItem";

const SidebarSubMenu = ({ items, pathname, openSubMenu, toggleSubMenu, hasPermission, toggleSidebar }) => {
  return (
    <ul className="space-y-4 relative text-[12px] list-outside">
      {items.map(
        (item) =>
          hasPermission(item.feature) && (
            <SidebarItem
              key={item.name}
              item={item}
              pathname={pathname}
              openSubMenu={openSubMenu}
              toggleSubMenu={toggleSubMenu}
              toggleSidebar={toggleSidebar} // **Tambahkan toggleSidebar**
            />
          )
      )}
    </ul>
  );
};

export default SidebarSubMenu;
