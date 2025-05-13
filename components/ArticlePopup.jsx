"use client";
import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";

const ArticlePopup = ({ articles = [], meta = { page: 1, totalPages: 1 }, onClose, onSelect, onPageChange }) => {
  // ✅ State langsung ambil dari props.meta (gunakan nilai default jika kosong)
  const [currentPage, setCurrentPage] = useState(meta?.page || 1);
  const [totalPages, setTotalPages] = useState(meta?.totalPages || 1);

  console.log("🔥 PROPS META: ", meta);

  // ✅ Update state currentPage & totalPages jika props.meta berubah
  useEffect(() => {
    if (meta?.page && meta?.totalPages) {
      console.log("✅ Updating meta data:", meta);
      setCurrentPage(meta.page);
      setTotalPages(meta.totalPages);
    }
  }, [meta]); // ✅ Pantau perubahan meta

  // ✅ Fungsi untuk mengganti halaman → Trigger parent component untuk ambil data baru
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage); // ✅ Update state lokal
      onPageChange(nextPage); // ✅ Trigger ke parent
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage); // ✅ Update state lokal
      onPageChange(prevPage); // ✅ Trigger ke parent
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-1/2 max-h-[90vh] overflow-auto relative">
        <h2 className="text-lg font-bold mb-4">Ganti Artikel</h2>

        {/* ✅ Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
        >
          <IoClose size={24} />
        </button>

        {/* ✅ Daftar Artikel */}
        {articles.length === 0 ? (
          <p className="text-center text-gray-500">Tidak ada artikel...</p>
        ) : (
          <ul className="space-y-2">
            {articles.map((article, index) => (
              <li
                key={article._id || article.article_id || `${article.platform_id}-${index}`}
                className="flex justify-between items-center p-2 border rounded-md hover:bg-gray-100"
              >
                <span className="text-sm">{article.title}</span>
                <button
                  onClick={() => onSelect(article)}
                  className="text-white bg-pink-500 hover:bg-pink-600 px-2 py-1 rounded-md text-sm"
                >
                  Pilih
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* ✅ Kontrol Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 border rounded-md ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Prev
          </button>

          <span className="text-sm">
            Halaman {currentPage} dari {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border rounded-md ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticlePopup;
