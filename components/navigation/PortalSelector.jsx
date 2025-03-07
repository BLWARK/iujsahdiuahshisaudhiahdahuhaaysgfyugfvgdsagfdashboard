"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { IoMdArrowDropdown } from "react-icons/io";
import portals from "@/data/portals";

const PortalSelector = ({ selectedPortal, setSelectedPortal }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const storedPortal = JSON.parse(localStorage.getItem("selectedPortal"));
    if (storedPortal) {
      setSelectedPortal(storedPortal);
    }
  }, [setSelectedPortal]);

  const handleSelectPortal = (portal) => {
    localStorage.setItem("selectedPortal", JSON.stringify(portal));
    setSelectedPortal(portal);
    setIsDropdownOpen(false);
    window.location.reload();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 bg-white text-main px-4 py-2 rounded-md hover:bg-gray-100 transition"
      >
        {selectedPortal ? (
          <>
            <Image
              src={selectedPortal.logo}
              alt={selectedPortal.name}
              width={30}
              height={30}
              className="rounded-full"
            />
            <span className="text-xs text-nowrap">{selectedPortal.name}</span>
          </>
        ) : (
          <span>Pilih Portal</span>
        )}
        <IoMdArrowDropdown size={20} />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white text-black shadow-md font-semibold rounded-md z-50">
          {portals.map((portal) => (
            <button
              key={portal.name}
              onClick={() => handleSelectPortal(portal)}
              className={`flex items-center gap-2 px-4 py-3 w-full text-left hover:bg-gray-100 rounded-md ${
                selectedPortal?.name === portal.name ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              <Image src={portal.logo} alt={portal.name} width={20} height={20} className="rounded-full" />
              {portal.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortalSelector;
