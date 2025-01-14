"use client";

import React, { useState, useEffect } from "react";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { loadArticlesByPortal } from "@/utils/loadPortalData";  // ✅ Import fungsi load data
import { getSelectedPortal } from "@/utils/portalUtils";        // ✅ Import fungsi portal

const ArticleTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [sortColumn, setSortColumn] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupReason, setPopupReason] = useState([]);

  const articlesPerPage = 15;

  // 🔄 Ambil data artikel sesuai portal yang dipilih
  useEffect(() => {
    const selectedPortal = getSelectedPortal();  // Ambil portal dari localStorage
    if (selectedPortal) {
      const articlesData = loadArticlesByPortal(selectedPortal.id);
      setFilteredArticles(articlesData);
    }
  }, []);

  // 🔀 Sorting Artikel
  const sortedArticles = [...filteredArticles].sort((a, b) => {
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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

  const openReasonPopup = (reason) => {
    setPopupReason(reason);
    setIsPopupOpen(true);
  };

  const closeReasonPopup = () => {
    setPopupReason([]);
    setIsPopupOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Daftar Artikel</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-4">#</th>
            <th className="border-b p-4">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleSort("title")}
              >
                Judul {getSortIcon("title")}
              </div>
            </th>
            <th className="border-b p-4">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleSort("category")}
              >
                Kategori {getSortIcon("category")}
              </div>
            </th>
            <th className="border-b p-4">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleSort("date")}
              >
                Tanggal {getSortIcon("date")}
              </div>
            </th>
            <th className="border-b p-4">Status</th>
            <th className="border-b p-4">Approved/Rejected By</th>
            <th className="border-b p-4">Aksi</th>
            <th className="border-b p-4">Alasan</th>
          </tr>
        </thead>
        <tbody>
          {currentArticles.map((article, index) => (
            <tr key={article.id} className="hover:bg-gray-50">
              <td className="border-b p-4">
                {index + 1 + (currentPage - 1) * articlesPerPage}
              </td>
              <td className="border-b p-4">{article.title}</td>
              <td className="border-b p-4">{article.category}</td>
              <td className="border-b p-4">{article.date}</td>
              <td className="border-b p-4">
                <span
                  className={`px-2 py-1 text-sm rounded-md ${
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
              <td className="border-b p-4">
                {article.status === "Published" && article.approvedBy ? (
                  <span className="text-green-600 font-medium">
                    {article.approvedBy}
                  </span>
                ) : article.status === "Rejected" && article.rejectedBy ? (
                  <span className="text-red-600 font-medium">
                    {article.rejectedBy}
                  </span>
                ) : (
                  "-"
                )}
              </td>
              <td className="border-b p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    className="text-blue-500 hover:text-blue-700 transition-all"
                    title="Edit Artikel"
                  >
                    <AiOutlineEdit size={20} />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 transition-all"
                    title="Hapus Artikel"
                  >
                    <AiOutlineDelete size={20} />
                  </button>
                </div>
              </td>
              <td className="border-b p-4 text-center">
                {article.status === "Rejected" && (
                  <button
                    onClick={() => openReasonPopup(article.reason)}
                    className="text-blue-500 underline hover:text-blue-700"
                  >
                    Lihat Alasan
                  </button>
                )}
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
        <span>Page {currentPage} of {totalPages}</span>
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

export default ArticleTable;
