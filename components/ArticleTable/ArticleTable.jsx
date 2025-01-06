"use client";
import React, { useState } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

const ArticleTable = ({ articles }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;

  // Hitung jumlah halaman
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  // Ambil data artikel berdasarkan halaman saat ini
  const currentArticles = articles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Daftar Artikel</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-4">#</th>
            <th className="border-b p-4">Judul</th>
            <th className="border-b p-4">Kategori</th>
            <th className="border-b p-4">Penulis</th>
            <th className="border-b p-4">Tanggal</th>
            <th className="border-b p-4">Status</th>
            <th className="border-b p-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentArticles.map((article, index) => (
            <tr key={article.id} className="hover:bg-gray-50">
              <td className="border-b p-4">{index + 1 + (currentPage - 1) * articlesPerPage}</td>
              <td className="border-b p-4">{article.title}</td>
              <td className="border-b p-4">{article.category}</td>
              <td className="border-b p-4">{article.author}</td>
              <td className="border-b p-4">{article.date}</td>
              <td className="border-b p-4">
                <span
                  className={`px-2 py-1 text-sm rounded-md ${
                    article.status === "Published"
                      ? "bg-green-200 text-green-700"
                      : "bg-yellow-200 text-yellow-700"
                  }`}
                >
                  {article.status}
                </span>
              </td>
              <td className="border-b p-4 space-x-4 flex items-center">
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

export default ArticleTable;
