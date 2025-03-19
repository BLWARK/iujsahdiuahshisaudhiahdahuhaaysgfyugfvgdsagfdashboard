"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { IoMdArrowDropdown } from "react-icons/io";
import { useBackend } from "@/context/BackContext";

const PortalSelector = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { selectedPortal, updatePlatform, getArticles } = useBackend(); 
  const [allowedPortals, setAllowedPortals] = useState([]);

  // ✅ Ambil daftar platform dari localStorage & update state `allowedPortals`
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedPlatforms = JSON.parse(localStorage.getItem("platforms") || "[]");

    // ✅ Format ulang agar sesuai dengan portal yang diharapkan (menambahkan logo)
    const formattedPortals = storedPlatforms.map((platform) => ({
      platform_id: platform.platform_id,
      platform_name: platform.platform_name,
      logo: getPortalLogo(platform.platform_name),
    }));

    setAllowedPortals(formattedPortals);

    // ✅ Ambil portal yang sebelumnya dipilih dari localStorage dan update ke Context
    const storedPortal = JSON.parse(localStorage.getItem("selectedPortal") || "null");

    if (storedPortal && formattedPortals.some((p) => p.platform_id === storedPortal.platform_id)) {
      console.log("✅ selectedPortal diambil dari localStorage:", storedPortal);
      updatePlatform(storedPortal); // ✅ Perbarui portal di BackContext
    }
  }, []);

  // ✅ Update tampilan saat `selectedPortal` berubah di BackContext
  useEffect(() => {
    console.log("🔄 selectedPortal diperbarui di PortalSelector:", selectedPortal);

    // ✅ Update daftar portal saat selectedPortal berubah
    setAllowedPortals((prevPortals) =>
      prevPortals.map((p) => ({
        ...p,
        isSelected: p.platform_id === selectedPortal?.platform_id, // ✅ Tandai portal yang dipilih
      }))
    );
  }, [selectedPortal]);

  // ✅ Fungsi untuk mendapatkan logo portal berdasarkan nama platform
  const getPortalLogo = (platformName) => {
    if (!platformName || typeof platformName !== "string") {
      return "/default-logo.png"; // Gunakan logo default jika tidak valid
    }

    const logoMap = {
      xyzonemedia: "/icon XYZone.png",
      lbj: "/Final Logo LBJ.png",
      coinzone: "/Artboard 2.png",
    };

    return logoMap[platformName.toLowerCase()] || "/default-logo.png";
  };

  // ✅ Fungsi untuk menangani pemilihan portal
  const handleSelectPortal = (portal) => {
    console.log("🌍 Portal dipilih:", portal);
    updatePlatform(portal); // 🔥 Perbarui portal di BackContext
    getArticles(portal.platform_id); // 🔥 Langsung panggil API setelah memilih portal
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 bg-white text-main px-4 py-2 rounded-md hover:bg-gray-100 transition"
      >
        {selectedPortal?.platform_id ? (
          (() => {
            const selectedPlatform = allowedPortals.find(
              (p) => p.platform_id === selectedPortal.platform_id
            );

            return selectedPlatform ? (
              <>
                <Image
                  src={getPortalLogo(selectedPlatform.platform_name)}
                  alt={selectedPlatform.platform_name}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <span className="text-xs text-nowrap">
                  {selectedPlatform.platform_name || "Pilih Portal"}
                </span>
              </>
            ) : (
              <span>Pilih Portal</span>
            );
          })()
        ) : (
          <span>Pilih Portal</span>
        )}
        <IoMdArrowDropdown size={20} />
      </button>

      {isDropdownOpen && (
        <div className="absolute left-0 mt-2 w-60 bg-white text-black shadow-md font-semibold rounded-md z-50">
          {allowedPortals.length > 0 ? (
            allowedPortals.map((portal) => (
              <button
                key={portal.platform_id}
                onClick={() => handleSelectPortal(portal)}
                className={`flex items-center gap-2 px-4 py-3 w-full text-left hover:bg-gray-100 rounded-md ${
                  portal.isSelected ? "bg-gray-200 font-semibold" : ""
                }`}
              >
                <Image
                  src={portal.logo}
                  alt={portal.platform_name}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                {portal.platform_name}
              </button>
            ))
          ) : (
            <p className="px-4 py-2 text-gray-500">
              ❌ Tidak ada portal yang tersedia
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PortalSelector;
