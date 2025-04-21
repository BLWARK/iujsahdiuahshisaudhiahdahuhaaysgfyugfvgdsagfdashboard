"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import DraftTable from "@/components/DraftTable/DraftTable";
import ArticleListSkeleton from "@/components/ArticleListSkeleton";
import { useBackend } from "@/context/BackContext";

const DraftPage = () => {
  const {
    articles,
    getDraftArticles,
    selectedPortal,
    setSelectedPortal,
  } = useBackend();

  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const hasFetched = useRef(false);
  const router = useRouter();

  const fetchDraftArticles = useCallback(async () => {
    if (!selectedPortal?.platform_id || isFetching || hasFetched.current) return;

    setIsFetching(true);
    try {
      await getDraftArticles();
    } catch (err) {
      console.error("❌ Error saat fetch draft:", err);
    } finally {
      setIsFetching(false);
      setIsLoading(false);
      hasFetched.current = true;
    }
  }, [selectedPortal, isFetching, getDraftArticles]);

  useEffect(() => {
    const storedPortal = JSON.parse(localStorage.getItem("selectedPortal"));
    if (!selectedPortal && storedPortal) {
      console.log("🔄 Memulihkan selectedPortal dari localStorage...");
      setSelectedPortal(storedPortal);
    }

    if (selectedPortal?.platform_id) {
      fetchDraftArticles();
    }
  }, [selectedPortal, fetchDraftArticles]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!selectedPortal?.platform_id) {
        console.warn("⚠️ Tidak ada portal. Arahkan ke /select-portal");
        router.push("/select-portal");
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [selectedPortal, router]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📝 Artikel Draft</h1>
      {isLoading ? (
        <ArticleListSkeleton count={10} />
      ) : (
        <DraftTable articles={articles} />
      )}
    </div>
  );
};

export default DraftPage;
