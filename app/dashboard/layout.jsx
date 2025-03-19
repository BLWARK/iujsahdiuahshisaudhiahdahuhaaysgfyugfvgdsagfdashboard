"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import { PortalProvider } from "@/context/PortalContext";
import { BackProvider } from "@/context/BackContext";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const selectedPortal = localStorage.getItem("selectedPortal");

    console.log("TOKEN DI DASHBOARD:", token);
    console.log("SELECTED PORTAL DI DASHBOARD:", selectedPortal);

    if (!token || !selectedPortal) {
      alert("Session expired! Silakan login kembali.");
      router.push("/login");
    }
  }, [router]);

  return (
    <BackProvider>
      <PortalProvider>
        <div className="flex h-screen">
          {/* Sidebar Tetap */}
          <Sidebar className="w-64" />

          {/* Konten Utama */}
          <div className="flex flex-col flex-1">
            {/* Navbar */}
            <Navbar className="w-full fixed top-0 left-64 z-50 bg-main text-white" />

            {/* Konten di Bawah Navbar */}
            <main className="flex-1 overflow-y-auto bg-gray-100 2xl:p-6 xl:p-6 lg:p-6 p-0 pb-20 text-main">
              {children}
            </main>
          </div>
        </div>
      </PortalProvider>
    </BackProvider>
  );
}
