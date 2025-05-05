"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import provincePortals from "../../data/provincePortals";

const portals = provincePortals;

export default function SelectPortal() {
  const router = useRouter();
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [allowedPortals, setAllowedPortals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const storedPlatforms = JSON.parse(localStorage.getItem("platforms") || "[]");
    const storedSelectedPortal = JSON.parse(localStorage.getItem("selectedPortal") || "null");

    if (!user || !storedPlatforms.length) {
      router.push("/login");
    } else {
      setAllowedPortals(storedPlatforms);
      setIsLoading(false);

      if (storedSelectedPortal) {
        setSelectedPortal(storedSelectedPortal);
      }
    }
  }, [router]);

  const handleSelectPortal = (portal) => {
    const matchedPortal = allowedPortals.find(p => p.platform_id === portal.id);
    if (matchedPortal) {
      setSelectedPortal(matchedPortal);
      localStorage.setItem("selectedPortal", JSON.stringify(matchedPortal));
    } else {
      console.warn("Portal tidak ditemukan dalam daftar platform yang diizinkan.");
    }
  };

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
      router.push("/dashboard");
    }
  };

  const handleClose = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("platforms");
    router.push("/login");
  };

  return (
    <div className="fixed inset-0  pb-20 flex items-center justify-center bg-main z-50 overflow-y-visible">
      <div className="bg-white px-6 py-10  md:px-12 md:py-16 rounded-lg shadow-2xl w-full max-w-xl relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl font-bold"
          title="Kembali ke Login"
        >
          ✖
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
          Pilih Provinsi
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex justify-center mb-8">
            <select
              onChange={(e) => {
                const selectedId = parseInt(e.target.value);
                const selected = portals.find(p => p.id === selectedId);
                handleSelectPortal(selected);
              }}
              value={selectedPortal?.platform_id || ""}
              className="w-full md:w-3/4 px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                -- Pilih Provinsi --
              </option>
              {portals.map((portal) => {
                const isAllowed = allowedPortals.some(p => p.platform_id === portal.id);
                return (
                  <option
                    key={portal.id}
                    value={portal.id}
                    disabled={!isAllowed}
                    className={!isAllowed ? "text-gray-400" : ""}
                  >
                    {portal.name} {!isAllowed ? "❌" : ""}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleConfirmSelection}
            disabled={!selectedPortal}
            className={`w-full md:w-auto px-8 py-3 text-lg font-semibold rounded-md transition-all duration-200 ${
              selectedPortal
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            {selectedPortal ? "Konfirmasi Pilihan" : "Pilih Portal"}
          </button>
        </div>
      </div>
    </div>
  );
}
