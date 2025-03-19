"use client"
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import DraftTable from "@/components/DraftTable/DraftTable";
import { useBackend } from "@/context/BackContext"; // Mengambil data dari context

  const DraftPage = () => {
    const { articles, getDraftArticles, selectedPortal } = useBackend();
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const router = useRouter();
    const hasFetched = useRef(false); // Gunakan useRef untuk menghindari fetch berulang
  
    // ✅ Fungsi untuk memanggil API artikel draft
    const fetchDraftArticles = useCallback(async () => {
      if (!selectedPortal?.platform_id || isFetching || hasFetched.current) return;
  
      setIsFetching(true);
      
      try {
        await getDraftArticles(); // Memanggil fungsi untuk mendapatkan artikel draft
      } catch (err) {
        console.error("❌ Error saat memanggil API:", err);
      } finally {
        setIsFetching(false);
        setIsLoading(false);
        hasFetched.current = true; // Tandai bahwa data sudah pernah diambil
      }
    }, [selectedPortal, isFetching, getDraftArticles]);
  
    useEffect(() => {
      // Pastikan selectedPortal ada sebelum melakukan pemanggilan API
      if (!selectedPortal?.platform_id) {
        console.warn("⚠️ Tidak ada portal yang dipilih! Redirect ke /select-portal");
        router.push("/select-portal"); // Redirect jika portal belum dipilih
        return;
      }
  
      fetchDraftArticles();
    }, [selectedPortal, fetchDraftArticles, router]);

  return (
    <div className="p-6">
      <DraftTable />
    </div>
  );
};

export default DraftPage;
