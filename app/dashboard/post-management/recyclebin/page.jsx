"use client";

import React, { useEffect, useState } from "react";
import RecycleBinTable from "@/components/Recyclebin/RecyclebinTable";
import { useBackend } from "@/context/BackContext";

const RecycleBinPage = () => {
  const { getDeletedArticles, selectedPortal } = useBackend();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchDeletedArticles = async () => {
      try {
        if (selectedPortal?.platform_id) {
          const data = await getDeletedArticles(selectedPortal.platform_id);
          setArticles(data);
        }
      } catch (error) {
        console.error("❌ Gagal mengambil artikel yang dihapus:", error);
      }
    };

    fetchDeletedArticles();
  }, [selectedPortal?.platform_id, getDeletedArticles]);

  return (
    <div className="p-6 space-y-6">
      <RecycleBinTable articles={articles} />
    </div>
  );
};

export default RecycleBinPage;
