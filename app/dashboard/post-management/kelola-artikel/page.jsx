"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import ArticleTable from "@/components/ArticleTable/ArticleTable";
import { useBackend } from "@/context/BackContext";

const KelolaArtikel = () => {
  const { articles, getArticles, selectedPortal } = useBackend();
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false); // 🔥 Mencegah pemanggilan ulang API
  const router = useRouter();
  const hasFetched = useRef(false); // 🔥 Gunakan useRef untuk mencegah fetch berulang

  // ✅ Bungkus getArticles dengan useCallback agar tidak selalu berubah
  const fetchArticles = useCallback(async () => {
    if (!selectedPortal?.platform_id || isFetching || hasFetched.current) return;

    console.log("🔄 Memanggil API untuk platform_id:", selectedPortal.platform_id);
    setIsFetching(true);
    
    try {
      await getArticles(selectedPortal.platform_id);
    } catch (err) {
      console.error("❌ Error saat memanggil API:", err);
    } finally {
      setIsFetching(false);
      setIsLoading(false);
      hasFetched.current = true; // ✅ Tandai bahwa fetch telah dilakukan
    }
  }, [selectedPortal, getArticles, isFetching]);

  // ✅ Panggil API hanya jika selectedPortal tersedia
  useEffect(() => {
    console.log("📌 selectedPortal di halaman Kelola Artikel:", selectedPortal);

    if (!selectedPortal?.platform_id) {
      console.warn("⚠️ Tidak ada portal yang dipilih! Redirect ke /select-portal");
      router.push("/select-portal"); // Redirect jika portal belum dipilih
      return;
    }

    fetchArticles();
  }, [selectedPortal, fetchArticles, router]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">
        Kelola Artikel 
      </h1>

      {isLoading ? (
        <p>Loading artikel...</p>
      ) : (
        <ArticleTable articles={articles} />
      )}
    </div>
  );
};

export default KelolaArtikel;
