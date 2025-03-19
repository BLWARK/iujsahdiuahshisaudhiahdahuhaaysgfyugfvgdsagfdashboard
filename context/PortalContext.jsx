"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation"; // ✅ Gunakan router untuk refresh halaman
import { loadCategoriesByPortal } from "@/utils/portalCategories";

const PortalContext = createContext();

export const PortalProvider = ({ children }) => {
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [categories, setCategories] = useState([]);
  const router = useRouter(); // ✅ Gunakan router

  useEffect(() => {
    const storedPortal = JSON.parse(localStorage.getItem("selectedPortal"));
    if (storedPortal) {
      setSelectedPortal(storedPortal);
      setCategories(loadCategoriesByPortal(storedPortal.id));
    }
  }, []);

  const updatePortal = (portal) => {
    setSelectedPortal(portal);
    localStorage.setItem("selectedPortal", JSON.stringify(portal));
    setCategories(loadCategoriesByPortal(portal.id));

    // ✅ Refresh halaman setelah portal berubah
    router.refresh();
  };

  return (
    <PortalContext.Provider value={{ selectedPortal, categories, updatePortal }}>
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => useContext(PortalContext);
