"use client";

import React, { useState } from "react";
import {
  AiOutlineEye,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import Image from "next/image";

const QueueAdsTable = ({ ads }) => {
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

  // 🔃 Fungsi Sorting
  const sortedAds = [...ads].sort((a, b) => {
    if (sortConfig.key === "name" || sortConfig.key === "space") {
      return sortConfig.direction === "asc"
        ? a[sortConfig.key].localeCompare(b[sortConfig.key])
        : b[sortConfig.key].localeCompare(a[sortConfig.key]);
    }

    if (sortConfig.key === "publishDate") {
      return sortConfig.direction === "asc"
        ? new Date(a.publishDate) - new Date(b.publishDate)
        : new Date(b.publishDate) - new Date(a.publishDate);
    }

    return 0;
  });

  // 🔄 Handle Klik Sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // 📊 Icon Sort
  const getSortIcon = (key) => {
    return sortConfig.key === key ? (
      sortConfig.direction === "asc" ? (
        <AiOutlineSortAscending size={16} />
      ) : (
        <AiOutlineSortDescending size={16} />
      )
    ) : (
      <AiOutlineSortAscending size={16} className="text-gray-400" />
    );
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">📋 Daftar Antrean Iklan</h2>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-4">Gambar</th>

            <th
              className="border-b p-4 cursor-pointer"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center gap-2">
                Nama Iklan {getSortIcon("name")}
              </div>
            </th>

            <th
              className="border-b p-4 cursor-pointer"
              onClick={() => handleSort("publishDate")}
            >
              <div className="flex items-center gap-2">
                Tanggal Publish {getSortIcon("publishDate")}
              </div>
            </th>

            <th
              className="border-b p-4 cursor-pointer"
              onClick={() => handleSort("space")}
            >
              <div className="flex items-center gap-2">
                Space {getSortIcon("space")}
              </div>
            </th>

            <th className="border-b p-4">Status</th>
            <th className="border-b p-4 w-32 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {sortedAds.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                Tidak ada iklan dalam antrean.
              </td>
            </tr>
          ) : (
            sortedAds.map((ad) => (
              <tr key={ad.id} className="hover:bg-gray-50">
                {/* 🖼️ Gambar */}
                <td className="border-b p-4">
                  <Image
                    src={ad.image || "/default-image.png"}
                    alt={ad.name}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                </td>

                {/* 📛 Nama Iklan */}
                <td className="border-b p-4">{ad.name}</td>

                {/* 📅 Tanggal Publish */}
                <td className="border-b p-4">{ad.publishDate}</td>

                {/* 🗂️ Space */}
                <td className="border-b p-4">{ad.space}</td>

                {/* ⏳ Status Antrean */}
                <td className="border-b p-4">
                  <span className="px-2 py-1 rounded-md text-xs bg-blue-200 text-blue-700">
                    Menunggu Antrean
                  </span>
                </td>

                {/* ⚙️ Aksi */}
                <td className="border-b p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      title="Preview"
                      className="text-blue-500 hover:text-blue-700 transition"
                    >
                      <AiOutlineEye size={20} />
                    </button>
                    <button
                      title="Edit"
                      className="text-green-500 hover:text-green-700 transition"
                    >
                      <AiOutlineEdit size={20} />
                    </button>
                    <button
                      title="Hapus"
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <AiOutlineDelete size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QueueAdsTable;
