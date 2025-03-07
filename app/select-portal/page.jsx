"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import portals from "@/data/portals"; // ✅ Import data portal

export default function SelectPortal() {
  const router = useRouter();
  const [selectedPortal, setSelectedPortal] = useState(null);

  // ✅ Cek apakah user sudah login
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      router.push("/login"); // Redirect ke login jika belum login
    }
  }, [router]);

  // ✅ Handle pemilihan portal
  const handleSelectPortal = (portal) => {
    setSelectedPortal(portal);
  };

  // ✅ Handle konfirmasi pilihan portal
  const handleConfirmSelection = () => {
    if (selectedPortal) {
      localStorage.setItem("selectedPortal", JSON.stringify(selectedPortal));
      router.push("/dashboard"); // Redirect ke dashboard
    }
  };

  // ✅ Handle tombol Close (Kembali ke Login)
  const handleClose = () => {
    localStorage.removeItem("currentUser"); // Optional: Logout user
    router.push("/login");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-main z-50 overflow-y-auto ">
      <div className="bg-white px-20 2xl:py-40 xl:py-40 lg:py-20 py-40 2xl:mt-0 xl:mt-0 lg:mt-0 mt-40 rounded-lg shadow-lg max-w-6xl w-full relative">
        {/* 🔴 Tombol Close di Pojok Kanan */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold transition-all"
          title="Kembali ke Login"
        >
          ✖
        </button>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Pilih Portal Berita
        </h1>

        {/* ✅ Portal List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portals.map((portal) => (
            <button
              key={portal.id}
              onClick={() => handleSelectPortal(portal)}
              className={`border-4 rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all ${
                selectedPortal?.id === portal.id
                  ? "border-blue-600 shadow-lg scale-105"
                  : "border-gray-300 hover:border-blue-300"
              }`}
            >
              <div className="relative w-32 h-32 mb-4">
                <Image
                  src={portal.logo}
                  alt={portal.name}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <h3 className="text-xl font-semibold">{portal.name}</h3>

              {selectedPortal?.id === portal.id && (
                <div className="mt-3 text-green-600 font-semibold">
                  ✅ Dipilih
                </div>
              )}
            </button>
          ))}
        </div>

        {/* ✅ Tombol Konfirmasi */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleConfirmSelection}
            disabled={!selectedPortal}
            className={`px-8 py-3 text-lg font-semibold rounded-md transition-all ${
              selectedPortal
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          >
            {selectedPortal ? "Konfirmasi Pilihan" : "Pilih Portal"}
          </button>
        </div>
      </div>
    </div>
  );
}
