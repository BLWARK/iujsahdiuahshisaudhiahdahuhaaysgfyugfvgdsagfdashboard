"use client";

import React, { useState, useEffect } from "react";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { useBackend } from "@/context/BackContext"; // Ambil data artikel dan fungsi getArticles dari context

const ArticleTable = () => {
  const { articles, getArticles, user } = useBackend(); // Ambil data artikel dan user dari context
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [prevPlatformId, setPrevPlatformId] = useState(null);

  const articlesPerPage = 15;

  // Ambil platform_id yang sudah dipilih dari localStorage
  useEffect(() => {
    const storedPortal = JSON.parse(localStorage.getItem("selectedPortal"));

    if (storedPortal && storedPortal.platform_id) {
      if (prevPlatformId !== storedPortal.platform_id) {
        getArticles(storedPortal.platform_id);
        setPrevPlatformId(storedPortal.platform_id);
      }
    }
    setIsLoading(false);
  }, [getArticles, prevPlatformId]);

  // Cek apakah `articles` adalah array dan user memiliki `author_id`
  const filteredArticles = Array.isArray(articles)
    ? articles.filter(
        (article) =>
          article.platform_id === JSON.parse(localStorage.getItem("selectedPortal"))?.platform_id &&
          article.author_id === user?.user_id // 🔥 Filter berdasarkan author_id
      )
    : [];

  // Sorting Artikel
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

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="bg-white p-6 rounded-md shadow-md w-full">
      <h2 className="text-2xl font-bold mb-6">
        Daftar Artikel - {JSON.parse(localStorage.getItem("selectedPortal"))?.platform_name || "Pilih Portal"}
      </h2>
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
            <th className="border-b p-4">Status</th>
            <th className="border-b p-4">Approved/Rejected By</th>
            <th className="border-b p-4">Aksi</th>
            <th className="border-b p-4">Alasan</th>
          </tr>
        </thead>
        <tbody>
          {currentArticles.map((article, index) => (
            <tr key={article._id} className="hover:bg-gray-50">
              <td className="border-b p-4">{index + 1 + (currentPage - 1) * articlesPerPage}</td>
              <td className="border-b p-4">{article.title}</td>
              <td className="border-b p-4">{article.category.length > 0 ? article.category.join(", ") : "No Category"}</td>
              <td className="border-b p-4">{new Date(article.date).toLocaleDateString()}</td>
              <td className="border-b p-4">
                <span
                  className={`px-2 py-1 text-sm rounded-md ${article.status === "Published" ? "bg-green-200 text-green-700" : article.status === "Rejected" ? "bg-red-200 text-red-700" : "bg-yellow-200 text-yellow-700"}`}
                >
                  {article.status}
                </span>
              </td>
              <td className="border-b p-4">{article.approved_by || "-"}</td>
              <td className="border-b p-4 text-center">
                <button className="text-blue-500 hover:text-blue-700">
                  <AiOutlineEdit size={20} />
                </button>
                <button className="text-red-500 hover:text-red-700 ml-2">
                  <AiOutlineDelete size={20} />
                </button>
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