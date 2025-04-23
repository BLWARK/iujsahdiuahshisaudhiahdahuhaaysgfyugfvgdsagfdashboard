"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

// ✅ Portal tersedia secara statis, tetapi akses dikontrol oleh backend
const portals = [
  { id: 1, name: "XYZone", logo: "/icon XYZone.png" },
  { id: 2, name: "LBJ", logo: "/Final Logo LBJ.png" },
  { id: 3, name: "CoinZone", logo: "/Artboard 2.png" },
];

export default function SelectPortal() {
  const router = useRouter();
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [allowedPortals, setAllowedPortals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Ambil data user dan platform dari localStorage
  useEffect(() => {
    if (typeof window === "undefined") return; // Hindari error SSR

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const storedPlatforms = JSON.parse(
      localStorage.getItem("platforms") || "[]"
    );
    const storedSelectedPortal = JSON.parse(
      localStorage.getItem("selectedPortal") || "null"
    );

    if (!user || !storedPlatforms.length) {
      router.push("/login"); // Redirect ke login jika belum login
    } else {
      setAllowedPortals(storedPlatforms);
      setIsLoading(false);

      // ✅ Jika ada portal yang sudah dipilih sebelumnya, gunakan kembali
      if (storedSelectedPortal) {
        console.log(
          "✅ Menggunakan portal yang sebelumnya dipilih:",
          storedSelectedPortal
        );
        setSelectedPortal(storedSelectedPortal);
      }
    }
  }, [router]);

  // ✅ Handle pemilihan portal
  const handleSelectPortal = (portal) => {
    const matchedPortal = allowedPortals.find(
      (p) => p.platform_id === portal.id
    );

    if (matchedPortal) {
      setSelectedPortal(matchedPortal);
      localStorage.setItem("selectedPortal", JSON.stringify(matchedPortal));
      console.log(
        "✅ Portal dipilih & disimpan di localStorage:",
        matchedPortal
      );
    } else {
      console.warn(
        "⚠️ Portal tidak ditemukan dalam daftar platform yang diizinkan."
      );
    }
  };

  // ✅ Pastikan user dan token masih ada di localStorage sebelum pindah ke dashboard
  const handleConfirmSelection = () => {
    if (!selectedPortal) {
      alert("Silakan pilih portal terlebih dahulu.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    if (!user || !token) {
      alert("Sesi login telah habis, silakan login kembali.");
      router.push("/login");
    } else {
      console.log("✅ Portal dikonfirmasi, redirect ke dashboard...");
      router.push("/dashboard");
    }
  };

  // ✅ Handle tombol Close (Kembali ke Login)
  const handleClose = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("platforms");
    router.push("/login");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-main z-50 overflow-y-auto">
      <div className="bg-white px-20 py-20 rounded-lg shadow-lg max-w-6xl w-full relative">
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

        {/* ✅ Tampilkan loading jika masih mengambil data */}
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="loader" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portals.map((portal) => {
              const isAllowed = allowedPortals.some(
                (p) => p.platform_id === portal.id
              );
              const isSelected = selectedPortal?.platform_id === portal.id;

              return (
                <button
                  key={portal.id}
                  onClick={() => handleSelectPortal(portal)}
                  disabled={!isAllowed}
                  className={`border-4 rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all ${
                    isSelected
                      ? "border-blue-600 shadow-lg scale-105"
                      : isAllowed
                      ? "border-gray-300 hover:border-blue-300"
                      : "border-gray-200 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="relative w-32 h-32 mb-4">
                    <Image
                      src={portal.logo}
                      alt={portal.name}
                      width={128}
                      height={128}
                      className="rounded-md"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">{portal.name}</h3>

                  {isSelected && (
                    <div className="mt-3 text-green-600 font-semibold">
                      ✅ Dipilih
                    </div>
                  )}

                  {!isAllowed && (
                    <p className="text-sm text-gray-500 mt-2">
                      ❌ Akses tidak tersedia
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}

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
