"use client";
import React from "react";
import ArticleTable from "@/components/ArticleTable/ArticleTable";
import { articles } from "@/data/articles";

const KelolaArtikel = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Kelola Artikel</h1>
      <ArticleTable articles={articles} />
    </div>
  );
};

export default KelolaArtikel;
