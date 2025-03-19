"use client";
import React, { useState, useEffect } from "react";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineSortAscending,
  AiOutlineSortDescending,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineEye,
} from "react-icons/ai";
import { formatDistanceToNow } from "date-fns";
import { useBackend } from "@/context/BackContext";

const ArticleReviewTable = () => {
  const { selectedPortal, articles, getArticles, approveArticle } = useBackend();
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState(null); // untuk menyimpan meta response dari backend
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Jumlah artikel per halaman (sesuai limit yang diinginkan)
  const articlesPerPage = 10;

  // Ambil data artikel berdasarkan platform_id dan halaman yang dipilih
  useEffect(() => {
    if (!selectedPortal?.platform_id) return;
    setIsLoading(true);
    getArticles(selectedPortal.platform_id, currentPage, articlesPerPage)
      .then((response) => {
        // Simpan meta response untuk pagination
        setMeta(response.meta);
      })
      .finally(() => setIsLoading(false));
  }, [selectedPortal, currentPage, getArticles]);

  // Sorting Artikel (misal, dilakukan secara lokal)
  const sortedArticles = [...articles].sort((a, b) => {
    const statusA = a.status?.toLowerCase();
    const statusB = b.status?.toLowerCase();
  
    // Jika satu artikel pending dan yang lain tidak, pending akan diurutkan paling atas
    if (statusA === "pending" && statusB !== "pending") return -1;
    if (statusA !== "pending" && statusB === "pending") return 1;
    
    // Jika kedua artikel sama-sama pending atau sama-sama bukan pending,
    // urutkan berdasarkan tanggal menggunakan field created_at dari backend
    return sortConfig.direction === "asc"
        ? new Date(a.created_at) - new Date(b.created_at)
        : new Date(b.created_at) - new Date(a.created_at);
  });
  
  

  // Gunakan meta.totalPages jika tersedia, jika tidak fallback ke 1
  const totalPages = meta ? meta.totalPages : 1;

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <AiOutlineSortAscending size={16} />
      ) : (
        <AiOutlineSortDescending size={16} />
      );
    }
    return <AiOutlineSortAscending size={16} className="text-gray-400" />;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) return <p>Loading artikel...</p>;

  return (
    <div className="bg-white p-6 rounded-md shadow-md overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6">
        📝 Daftar Artikel - {selectedPortal?.platform_name || "Pilih Portal"}
      </h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-4">#</th>
            <th
              className="border-b p-4 cursor-pointer"
              onClick={() => handleSort("title")}
            >
              <div className="flex items-center gap-1">
                Judul {getSortIcon("title")}
              </div>
            </th>
            <th className="border-b p-4">Kategori</th>
            <th
              className="border-b p-4 cursor-pointer"
              onClick={() => handleSort("author")}
            >
              <div className="flex items-center gap-1">
                Penulis {getSortIcon("author")}
              </div>
            </th>
            <th
              className="border-b p-4 cursor-pointer"
              onClick={() => handleSort("date")}
            >
              <div className="flex items-center gap-1">
                Tanggal {getSortIcon("date")}
              </div>
            </th>
            <th
              className="border-b p-4 cursor-pointer"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center gap-1">
                Status {getSortIcon("status")}
              </div>
            </th>
            <th className="border-b p-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {sortedArticles.map((article, index) => (
            <tr key={article.article_id || article._id || index} className="hover:bg-gray-50">
              <td className="border-b p-4">
                {index + 1 + (currentPage - 1) * articlesPerPage}
              </td>
              <td className="border-b p-4">
                <div className="flex items-center gap-2">
                  {/* Tombol Preview di sebelah kiri judul */}
                  <button
                    className="text-blue-500 hover:text-blue-700 transition-all"
                    title="Preview Artikel"
                    onClick={() => console.log("Preview", article.article_id)}
                  >
                    <AiOutlineEye size={20} />
                  </button>
                  {article.title}
                </div>
              </td>
              <td className="border-b p-4">
                {article.category?.length > 0 ? article.category.join(", ") : "No Category"}
              </td>
              <td className="border-b p-4">
                {article.author?.username || "Tidak Dikenal"}
              </td>
              <td className="border-b p-4 text-xs">
                {formatDistanceToNow(new Date(article.date), { addSuffix: true })}
              </td>
              <td className="border-b p-4">
                <span
                  className={`px-2 py-1 rounded-md text-xs ${
                    article.status === "Published"
                      ? "bg-green-200 text-green-700"
                      : article.status === "Rejected"
                      ? "bg-red-200 text-red-700"
                      : "bg-yellow-200 text-yellow-700"
                  }`}
                >
                  {article.status}
                </span>
              </td>
              <td className="border-b p-4 space-x-4 flex items-center">
                {article.status === "Pending" && (
                  <>
                    <button
                      className="text-green-500 hover:text-green-700 transition-all"
                      title="Setujui Artikel"
                      onClick={() => approveArticle(article.article_id)}
                    >
                      <AiOutlineCheck size={20} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 transition-all"
                      title="Tolak Artikel"
                      onClick={() => console.log("Reject", article.article_id)}
                    >
                      <AiOutlineClose size={20} />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-8 flex justify-between items-center">
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
    </div>
  );
};

export default ArticleReviewTable;
