"use client";

import React, { useState, useEffect } from "react";
import ArticleReviewTable from "@/components/ArticleReviewTable/ArticleReviewTable";
import { articles } from "@/data/articles"; // Import data artikel
import ArticleListSkeleton from "@/components/ArticleListSkeleton";


const ArticleReviewPage = () => {
  const [reviewArticles, setReviewArticles] = useState(articles);
  const [isLoading, setIsLoading] = useState(true);

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
    const confirm = window.confirm("Yakin ingin menghapus artikel ini?");
    if (!confirm) return;
  
    try {
      // Kalau kamu udah setup deleteArticleById di BackContext:
      // await deleteArticleById(id);
  
      // Kalau sementara pakai frontend dummy data:
      setReviewArticles((prev) => prev.filter((article) => article.id !== id));
  
      alert(`🗑️ Artikel dengan ID ${id} telah dihapus.`);
    } catch (err) {
      console.error("❌ Gagal menghapus artikel:", err);
      alert("❌ Gagal menghapus artikel: " + err.message);
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
