"use client";

import React, { useState, useEffect } from "react";
import ArticleReviewTable from "@/components/ArticleReviewTable/ArticleReviewTable";
import { articles } from "@/data/articles"; // Import data artikel
import ArticleListSkeleton from "@/components/ArticleListSkeleton";
import Swal from "sweetalert2";
import { useBackend } from "@/context/BackContext";

const ArticleReviewPage = () => {
  const [reviewArticles, setReviewArticles] = useState(articles);
  const [isLoading, setIsLoading] = useState(true);

  const { getArticles, markArticleAsDeleted, selectedPortal } = useBackend();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 800); // ⏳ Simulasi delay loading 800ms

    return () => clearTimeout(timeout);
  }, []);

  const handleApprove = (id) => {
    setReviewArticles((prev) =>
      prev.map((article) =>
        article.id === id ? { ...article, status: "publish" } : article
      )
    );
    alert(`Artikel dengan ID ${id} telah disetujui.`);
  };

  const handleReject = (id) => {
    setReviewArticles((prev) =>
      prev.map((article) =>
        article.id === id ? { ...article, status: "Rejected" } : article
      )
    );
    alert(`Artikel dengan ID ${id} telah ditolak.`);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin hapus artikel?",
      text: "Artikel akan ditandai sebagai 'deleted'.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await markArticleAsDeleted(id);
      await getArticles(selectedPortal.platform_id);
      Swal.fire("Sukses", "Artikel berhasil dihapus.", "success");
    } catch (err) {
      console.error("❌ Gagal ubah status artikel:", err);
      Swal.fire("Error", "Gagal menghapus artikel.", "error");
    }
  };

  return (
    <div className="p-6 2xl:w-full xl:w-full lg:w-full md:w-full w-[390px]">
      {isLoading ? (
        <ArticleListSkeleton count={6} />
      ) : (
        <ArticleReviewTable
          articles={reviewArticles}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ArticleReviewPage;
