"use client";

import React, { useState, useEffect } from "react";
import { AiOutlineBell } from "react-icons/ai";
import { useRouter } from "next/navigation"; // Gunakan router dari next/navigation
import { formatDistanceToNow } from "date-fns";
import users from "@/data/users";
import { notificationsDummy } from "@/data/notifications";

const Notification = () => {
  const router = useRouter(); // Inisialisasi router
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      const detailedUser = users.find((u) => u.id === storedUser.id);
      setUser(detailedUser || storedUser);
    }

    setNotifications(notificationsDummy);
  }, []);

  useEffect(() => {
    const unread = notifications.filter((notif) => !notif.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const markAsRead = (id, url) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
    if (url) {
      router.push(url); // Navigasi ke URL yang ditentukan
    }
  };

  return (
    <div className="flex items-center justify-between bg-main text-white py-4 px-10 shadow-md">
      {(user?.role === "Master" ||
        user?.role === "Super Admin" ||
        user?.role === "Editor") && (
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="relative flex items-center text-white"
          >
            <AiOutlineBell size={30} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex h-3 w-3 rounded-full bg-red-500"></span>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute 2xl:right-0 xl:right-0 lg:right-0 -right-20 mt-2 w-80 bg-white shadow-lg rounded-md p-4 z-50">
              <h3 className="text-md font-semibold mb-2 text-black">Notifikasi</h3>
              {notifications.length > 0 ? (
                <ul>
                  {notifications.map((notif, index) => (
                    <li key={notif.id}>
                      <div
                        className={`p-3 rounded-md cursor-pointer hover:bg-gray-100 text-sm ${
                          notif.read ? "text-gray-500" : "text-gray-800"
                        }`}
                        onClick={() => markAsRead(notif.id, notif.url)}
                      >
                        <p className="font-medium">{notif.message}</p>
                        <p className="text-gray-400 text-xs">Dari: {notif.sender}</p>
                        <p className="text-gray-400 text-xs">
                          {formatDistanceToNow(new Date(notif.timestamp), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      {index < notifications.length - 1 && (
                        <hr className="border-gray-200 my-2" />
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">Tidak ada notifikasi.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
