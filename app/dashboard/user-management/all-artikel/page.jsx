"use client";

import React, { useState } from "react";
import ArticleReviewTable from "@/components/ArticleReviewTable/ArticleReviewTable";
import { articles } from "@/data/articles"; // Import data artikel

const ArticleReviewPage = () => {
  const [reviewArticles, setReviewArticles] = useState(articles);

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

  return (
    <div className="p-6">
      <ArticleReviewTable
        articles={reviewArticles}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default ArticleReviewPage;
