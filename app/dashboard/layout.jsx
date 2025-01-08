"use client";
import React from "react";
import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar Tetap */}
      <Sidebar className="w-64" />

      {/* Konten Utama */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <Navbar className="w-full fixed top-0 left-64 z-50 bg-main text-white" />

        {/* Konten di Bawah Navbar */}
        <main className="flex-1 overflow-y-auto  bg-gray-100 p-6 text-main">
          {children}
        </main>
      </div>
    </div>
  );
}
