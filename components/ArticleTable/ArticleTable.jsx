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
import ArticlePreviewModal from "@/components/ArticlePreviewModal";

const ArticleTable = () => {
  const {
    articles,
    getArticles,
    selectedPortal,
    user,
    getArticleById,
    handleEditArticle,
    deleteArticleById,
  } = useBackend();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isLoading, setIsLoading] = useState(true);

  const [previewData, setPreviewData] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const router = useRouter();
  const articlesPerPage = 15;

  useEffect(() => {
    if (selectedPortal?.platform_id) {
      getArticles(selectedPortal.platform_id)
        .then(() => setIsLoading(false))
        .catch((err) => console.error("❌ Gagal memuat artikel:", err));
    }
  }, [selectedPortal, getArticles]);

  const filteredArticles = Array.isArray(articles)
    ? articles.filter(
        (article) =>
          article.platform_id === selectedPortal?.platform_id &&
          article.author_id === user?.user_id
      )
    : [];

  const sortedArticles = filteredArticles.sort((a, b) => {
    const valueA = a[sortColumn];
    const valueB = b[sortColumn];

    if (sortColumn === "date") {
      return sortOrder === "asc"
        ? new Date(valueA) - new Date(valueB)
        : new Date(valueB) - new Date(valueA);
    }

    if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
    if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedArticles.length / articlesPerPage);

  const currentArticles = sortedArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  const handlePageChange = (page) => setCurrentPage(page);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const getSortIcon = (column) => {
    if (sortColumn === column) {
      return sortOrder === "asc" ? (
        <AiOutlineSortAscending size={16} />
      ) : (
        <AiOutlineSortDescending size={16} />
      );
    }
    return <AiOutlineSortAscending size={16} className="text-gray-400" />;
  };

  const handleView = async (articleId) => {
    try {
      const data = await getArticleById(articleId);
      setPreviewData({
        ...data,
        content: he.decode(data.content || ""),
      });
      setIsPreviewOpen(true);
    } catch (err) {
      console.error("❌ Gagal ambil artikel:", err);
    }
  };

  const handleDelete = async (articleId) => {
    const confirm = window.confirm("🗑️ Yakin ingin menghapus artikel ini?");
    if (!confirm) return;

    try {
      await deleteArticleById(articleId);
      await getArticles(selectedPortal.platform_id); // ✅ Refresh ulang data
    } catch (err) {
      console.error("❌ Gagal hapus artikel:", err);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="bg-white p-6 rounded-md shadow-md w-full">
      <h2 className="text-2xl font-bold mb-6">
        Daftar Artikel - {selectedPortal?.platform_name || "Pilih Portal"}
      </h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-4">#</th>
            <th
              className="border-b p-4 cursor-pointer"
              onClick={() => handleSort("title")}
            >
              <div className="flex items-center gap-2">
                Judul {getSortIcon("title")}
              </div>
            </th>
            <th
              className="border-b p-4 cursor-pointer"
              onClick={() => handleSort("category")}
            >
              <div className="flex items-center gap-2">
                Kategori {getSortIcon("category")}
              </div>
            </th>
            <th
              className="border-b p-4 cursor-pointer"
              onClick={() => handleSort("date")}
            >
              <div className="flex items-center gap-2">
                Tanggal {getSortIcon("date")}
              </div>
            </th>
            <th
              className="border-b p-4 cursor-pointer"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center gap-2">
                Status {getSortIcon("status")}
              </div>
            </th>
            <th className="border-b p-4">Approved/Rejected By</th>
            <th className="border-b p-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentArticles.map((article, index) => (
            <tr key={article._id} className="hover:bg-gray-50">
              <td className="border-b p-4">
                {index + 1 + (currentPage - 1) * articlesPerPage}
              </td>
              <td className="border-b p-4">{article.title}</td>
              <td className="border-b p-4">
                {Array.isArray(article.category)
                  ? article.category.join(", ")
                  : article.category || "No Category"}
              </td>
              <td className="border-b p-4">
                {new Date(article.date).toLocaleDateString()}
              </td>
              <td
                className={`border-b p-4 font-semibold ${
                  article.status === "Publish"
                    ? "text-green-600"
                    : article.status === "Reject"
                    ? "text-red-600"
                    : "text-orange-500"
                }`}
              >
                {article.status}
              </td>
              <td className="border-b p-4">{article.approved_by || "-"}</td>
              <td className="border-b p-4 text-center flex gap-2">
                <button
                  className="text-green-500 hover:text-green-700"
                  onClick={() => handleView(article.article_id)}
                  title="Lihat"
                >
                  <AiOutlineEye size={20} />
                </button>
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handleEditArticle(article.article_id, router)}
                >
                  <AiOutlineEdit size={20} />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(article.article_id)}
                  title="Hapus Artikel"
                >
                  <AiOutlineDelete size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
        >
          Next
        </button>
      </div>

      {/* ✅ Modal untuk preview artikel */}
      {isPreviewOpen && previewData && (
        <ArticlePreviewModal
          article={previewData}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
};

export default ArticleTable;
