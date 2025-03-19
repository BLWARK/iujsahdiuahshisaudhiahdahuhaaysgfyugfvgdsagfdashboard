"use client";
import React, { useState } from "react";
import {
  AiOutlineReload,
  AiOutlineDelete,
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";

const RecycleBinTable = ({ articles }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const articlesPerPage = 15;

  // Fungsi untuk mengurutkan artikel
  const sortedArticles = [...articles].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Paginate Articles
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

  return (
    <div className="bg-white p-6 rounded-md shadow-md 2xl:w-full xl:w-full lg:w-full w-[350px] overflow-x-scroll">
      <h2 className="text-2xl font-bold mb-6">🗑️ Recycle Bin</h2>
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
              onClick={() => handleSort("author")}
            >
              <div className="flex items-center gap-2">
                Penulis {getSortIcon("author")}
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
            <th className="border-b p-4">Aksi</th>
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
              <td className="border-b p-4">{article.author || "N/A"}</td>
              <td className="border-b p-4">{article.date}</td>
              <td className="border-b p-4 space-x-4 flex items-center">
                <button
                  className="text-green-500 hover:text-green-700 transition-all"
                  title="Restore Artikel"
                >
                  <AiOutlineReload size={20} />
                </button>
                <button
                  className="text-red-500 hover:text-red-700 transition-all"
                  title="Hapus Permanen"
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
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-all"
        >
          Previous
        </button>
        <span className="text-lg font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RecycleBinTable;
