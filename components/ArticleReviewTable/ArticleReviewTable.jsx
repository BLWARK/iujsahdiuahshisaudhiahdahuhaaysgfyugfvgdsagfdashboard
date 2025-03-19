"use client";

import React, { useState, useEffect } from "react";
import {
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineEye,
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { formatDistanceToNow } from "date-fns";
import { useBackend } from "@/context/BackContext"; // Gunakan BackContext untuk mengambil artikel

const ArticleReviewTable = () => {
  const { articles, getArticles, approveArticle } = useBackend(); // Mengambil artikel dari BackContext
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "status",
    direction: "asc",
  });
  const [isRejectPopupOpen, setIsRejectPopupOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectArticleId, setRejectArticleId] = useState(null);
  const [isPreviewPopupOpen, setIsPreviewPopupOpen] = useState(false);
  const [previewArticle, setPreviewArticle] = useState(null);

  // Ambil data artikel "Pending" saja
  const pendingArticles = articles.filter(
    (article) => article.status === "Pending"
  );

  useEffect(() => {
    getArticles(); // Ambil data artikel saat komponen pertama kali dimuat
  }, [getArticles]);

  // Urutkan Artikel
  const sortedArticles = [...pendingArticles].sort((a, b) => {
    if (sortConfig.key === "date") {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    }
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Fungsi untuk mengubah urutan penyortiran
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Menampilkan ikon untuk urutan penyortiran
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

  // Fungsi untuk membuka popup penolakan
  const openRejectPopup = (id) => {
    setRejectArticleId(id);
    setIsRejectPopupOpen(true);
  };

  // Fungsi untuk menutup popup penolakan
  const closeRejectPopup = () => {
    setRejectReason("");
    setRejectArticleId(null);
    setIsRejectPopupOpen(false);
  };

  // Fungsi untuk mengonfirmasi penolakan artikel
  const confirmReject = () => {
    if (rejectReason.trim() === "") {
      alert("Masukkan alasan penolakan terlebih dahulu.");
      return;
    }
    // Panggil fungsi onReject yang akan menangani penolakan
    // onReject(rejectArticleId, rejectReason);
    closeRejectPopup();
  };

  // Fungsi untuk membuka popup pratinjau artikel
  const openPreviewPopup = (article) => {
    setPreviewArticle(article);
    setIsPreviewPopupOpen(true);
  };

  // Fungsi untuk menutup popup pratinjau artikel
  const closePreviewPopup = () => {
    setPreviewArticle(null);
    setIsPreviewPopupOpen(false);
  };

  // Ambil nama penulis dari localStorage
  // Fungsi untuk mengambil nama penulis berdasarkan artikel
const getAuthorName = (article) => {
  return article.author?.username || "Tidak Dikenal"; // Menggunakan data author dari artikel
};


  // Fungsi untuk menangani approve artikel
  const handleApprove = async (articleId) => {
    try {
      // Panggil fungsi approveArticle dari BackContext
      await approveArticle(articleId);
      alert("Artikel berhasil disetujui!");
    } catch (error) {
      console.error("Gagal menyetujui artikel:", error);
      alert("Terjadi kesalahan saat menyetujui artikel.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md 2xl:w-full xl:w-full lg:w-full w-[350px] overflow-x-scroll">
      <h2 className="text-2xl font-bold mb-6">📝 Daftar Artikel</h2>
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
            <tr key={article.article_id || index} className="hover:bg-gray-50">
              <td className="border-b p-4">{index + 1}</td>
              <td className="border-b p-4">
                <div className="flex items-center gap-2">
                  <button
                    className="text-blue-500 hover:text-blue-700 transition-all"
                    title="Preview Artikel"
                    onClick={() => openPreviewPopup(article)}
                  >
                    <AiOutlineEye size={16} />
                  </button>
                  {article.title}
                </div>
              </td>
              <td className="border-b p-4">{article.category}</td>
              <td className="border-b p-4">{getAuthorName(article)}</td>
              {/* Ambil nama penulis dari localStorage */}
              <td className="border-b p-4 text-xs">
                {formatDistanceToNow(new Date(article.date), {
                  addSuffix: true,
                })}
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
                      onClick={() => handleApprove(article.article_id)} // Menggunakan handleApprove
                    >
                      <AiOutlineCheck size={20} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 transition-all"
                      title="Tolak Artikel"
                      onClick={() => openRejectPopup(article.article_id)}
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

      {/* Popup Preview Artikel */}
      {isPreviewPopupOpen && previewArticle && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-1/2">
            <h3 className="text-lg font-semibold mb-4">
              {previewArticle.title}
            </h3>
            <img
              src={previewArticle.image}
              alt={previewArticle.title}
              className="mb-4 w-full rounded-md"
            />
            <p className="mb-2">
              <strong>Kategori:</strong> {previewArticle.category}
            </p>
            <p className="mb-2">
              <strong>Penulis:</strong> {getAuthorName()}
            </p>
            <p className="mb-2">
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded-md text-xs ${
                  previewArticle.status === "Published"
                    ? "bg-green-200 text-green-700"
                    : previewArticle.status === "Rejected"
                    ? "bg-red-200 text-red-700"
                    : "bg-yellow-200 text-yellow-700"
                }`}
              >
                {previewArticle.status}
              </span>
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                onClick={closePreviewPopup}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Alasan Penolakan */}
      {isRejectPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h3 className="text-lg font-semibold mb-4">Alasan Penolakan</h3>
            <textarea
              className="w-full border rounded-md p-2 mb-4"
              rows="4"
              placeholder="Masukkan alasan penolakan"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                onClick={closeRejectPopup}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={confirmReject}
              >
                Konfirmasi Penolakan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleReviewTable;
