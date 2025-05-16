"use client";
import React, { useState, useEffect } from "react";
import {
  AiOutlineReload,
  AiOutlineDelete,
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { useBackend } from "@/context/BackContext";

const RecycleBinTable = () => {
  const {
    getDeletedArticles,
    selectedPortal,
    markArticleAsDeleted,
    submitEditedArticle,
  } = useBackend();
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const articlesPerPage = 15;

  useEffect(() => {
    if (!selectedPortal?.platform_id) return;

    const fetchDeletedArticles = async () => {
      try {
        const data = await getDeletedArticles(selectedPortal.platform_id);
        setArticles(data);
      } catch (error) {
        console.error("❌ Gagal mengambil artikel terhapus:", error);
      }
    };

    fetchDeletedArticles();
  }, [selectedPortal?.platform_id, getDeletedArticles]);

  const sortedArticles = [...articles].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedArticles.length / articlesPerPage);
  const currentArticles = sortedArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (column) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === "asc" ? (
        <AiOutlineSortAscending size={16} />
      ) : (
        <AiOutlineSortDescending size={16} />
      );
    }
    return <AiOutlineSortAscending size={16} className="text-gray-400" />;
  };

  const handleRestore = async (article_Id, originalArticle) => {
    try {
      await submitEditedArticle(article_Id, {
        ...originalArticle,
        article_id: article_Id,
        status: "pending",
      });
      const updated = await getDeletedArticles(selectedPortal.platform_id);
      setArticles(updated);
    } catch (err) {
      console.error("❌ Gagal restore artikel:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md w-full overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6">🗑️ Recycle Bin</h2>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full table-auto text-left border">
          <thead>
            <tr className="bg-gray-100">
              {["#", "Judul", "Kategori", "Penulis", "Tanggal", "Aksi"].map(
                (label) => (
                  <th
                    key={label}
                    className="border px-4 py-2 whitespace-nowrap cursor-pointer"
                    onClick={() =>
                      !["#", "Aksi"].includes(label) &&
                      handleSort(
                        label === "Judul"
                          ? "title"
                          : label === "Kategori"
                          ? "category"
                          : label === "Penulis"
                          ? "author"
                          : label.toLowerCase()
                      )
                    }
                  >
                    <div className="flex items-center gap-1">
                      {label} {getSortIcon(label.toLowerCase())}
                    </div>
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {currentArticles.map((article, index) => (
              <tr key={article._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">
                  {index + 1 + (currentPage - 1) * articlesPerPage}
                </td>
                <td className="border px-4 py-2">{article.title}</td>
                <td className="border px-4 py-2">{article.category}</td>
                <td className="border px-4 py-2">
                  {article.author?.username || article.author?.fullname || "N/A"}
                </td>
                <td className="border px-4 py-2">{article.date}</td>
                <td className="border px-4 py-2">
                  <div className="flex gap-2">
                    <button
                      className="text-green-500 hover:text-green-700"
                      title="Restore Artikel"
                      onClick={() =>
                        handleRestore(article.article_id, article)
                      }
                    >
                      <AiOutlineReload size={20} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      title="Hapus Permanen"
                    >
                      <AiOutlineDelete size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-8 gap-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300"
        >
          Previous
        </button>
        <span className="text-lg font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RecycleBinTable;