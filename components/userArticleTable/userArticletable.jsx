import React, { useState } from "react";
import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";

const UserArticleTable = ({ articles }) => {
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });

  // 🔄 Handle Sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // 🔀 Sorting Artikel
  const sortedArticles = [...articles].sort((a, b) => {
    if (sortConfig.direction === "asc") {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    } else {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
  });

  // 🔽 Icon Sorting
  const getSortIcon = (key) => {
    return sortConfig.key === key && sortConfig.direction === "asc" ? (
      <AiOutlineSortAscending size={16} />
    ) : (
      <AiOutlineSortDescending size={16} />
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">📊 Daftar Artikel User</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
              <th
                onClick={() => handleSort("title")}
                className="py-3 px-4 cursor-pointer hover:bg-gray-200"
              >
                <div className="flex items-center justify-between">
                  Judul {getSortIcon("title")}
                </div>
              </th>
              <th
                onClick={() => handleSort("category")}
                className="py-3 px-4 cursor-pointer hover:bg-gray-200"
              >
                <div className="flex items-center justify-between">
                  Kategori {getSortIcon("category")}
                </div>
              </th>
              <th
                onClick={() => handleSort("date")}
                className="py-3 px-4 cursor-pointer hover:bg-gray-200"
              >
                <div className="flex items-center justify-between">
                  Tanggal {getSortIcon("date")}
                </div>
              </th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedArticles.map((article, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition duration-300 border-b border-gray-100"
              >
                <td className="py-3 px-4">{article.title}</td>
                <td className="py-3 px-4">{article.category}</td>
                <td className="py-3 px-4">{article.date}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      article.status === "Published"
                        ? "bg-green-100 text-green-800"
                        : article.status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {article.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserArticleTable;
