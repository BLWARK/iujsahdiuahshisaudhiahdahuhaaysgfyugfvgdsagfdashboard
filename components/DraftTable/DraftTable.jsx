"use client";
import React, { useState, useEffect } from "react";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { useBackend } from "@/context/BackContext";
import { useRouter } from "next/navigation";
import he from "he";
import ArticlePreviewModal from "@/components/ArticlePreviewModal"; // ✅ Komponen popup

const DraftTable = () => {
  const {
    articles,
    getDraftArticles,
    deleteArticleById,
    handleEditArticle,
    selectedPortal,
    user,
    getArticleById,
  } = useBackend();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const articlesPerPage = 15;
  const router = useRouter();

  useEffect(() => {
    if (selectedPortal?.platform_id && user?.user_id) {
      getDraftArticles();
    }
  }, [selectedPortal, user]);

  const filteredArticles = Array.isArray(articles)
    ? articles.filter((a) => a.author_id === user?.user_id)
    : [];

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    let valueA = a[sortConfig.key];
    let valueB = b[sortConfig.key];

    if (sortConfig.key === "date") {
      valueA = new Date(valueA);
      valueB = new Date(valueB);
    } else if (Array.isArray(valueA)) {
      valueA = valueA[0] || "";
      valueB = valueB[0] || "";
    }

    if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedArticles.length / articlesPerPage);
  const currentArticles = sortedArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  const handlePageChange = (page) => setCurrentPage(page);

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

  const handleEdit = (articleId) => handleEditArticle(articleId, router);

  const handleDelete = async (articleId) => {
    const confirm = window.confirm("🗑️ Yakin ingin menghapus draft ini?");
    if (!confirm) return;
    try {
      await deleteArticleById(articleId);
      await getDraftArticles();
    } catch (err) {
      console.error("❌ Gagal menghapus draft:", err);
    }
  };

  const handleView = async (articleId) => {
    try {
      const data = await getArticleById(articleId);
      setPreviewData(data);
      setIsPreviewOpen(true);
    } catch (err) {
      console.error("❌ Gagal mengambil detail artikel:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md 2xl:w-full xl:w-full lg:w-full w-[350px] overflow-x-scroll">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-4">#</th>
            <th className="border-b p-4 cursor-pointer" onClick={() => handleSort("title")}>
              <div className="flex items-center gap-2">Judul {getSortIcon("title")}</div>
            </th>
            <th className="border-b p-4 cursor-pointer" onClick={() => handleSort("category")}>
              <div className="flex items-center gap-2">Kategori {getSortIcon("category")}</div>
            </th>
            <th className="border-b p-4 cursor-pointer" onClick={() => handleSort("date")}>
              <div className="flex items-center gap-2">Tanggal {getSortIcon("date")}</div>
            </th>
            <th className="border-b p-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentArticles.map((article, index) => (
            <tr key={article.article_id || index} className="hover:bg-gray-50">
              <td className="border-b p-4">
                {index + 1 + (currentPage - 1) * articlesPerPage}
              </td>
              <td className="border-b p-4">{article.title || "-"}</td>
              <td className="border-b p-4">
                {Array.isArray(article.category)
                  ? article.category.join(", ")
                  : article.category || "-"}
              </td>
              <td className="border-b p-4">
                {article.date
                  ? new Date(article.date).toLocaleDateString()
                  : "-"}
              </td>
              <td className="border-b p-4 space-x-4 flex items-center">
                <button
                  onClick={() => handleView(article.article_id)}
                  className="text-green-500 hover:text-green-700"
                  title="Lihat Draft"
                >
                  <AiOutlineEye size={20} />
                </button>
                <button
                  onClick={() => handleEdit(article.article_id)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Edit Draft"
                >
                  <AiOutlineEdit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(article.article_id)}
                  className="text-red-500 hover:text-red-700"
                  title="Hapus Draft"
                >
                  <AiOutlineDelete size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
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

      {/* Modal Preview */}
      {isPreviewOpen && previewData && (
        <ArticlePreviewModal
          article={previewData}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
};

export default DraftTable;
