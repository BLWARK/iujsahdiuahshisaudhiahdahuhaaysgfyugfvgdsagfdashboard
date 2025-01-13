"use client";

import React, { useState, useEffect } from "react";
import { differenceInDays, parseISO } from "date-fns";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineEye
} from "react-icons/ai";
import Image from "next/image";

const AdvertisingTable = ({ ads }) => {
  const [calculatedAds, setCalculatedAds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "status", direction: "asc" });

  useEffect(() => {
    const updatedAds = ads.map((ad) => {
      const expirationDate = new Date(parseISO(ad.publishDate)).setMonth(
        new Date(parseISO(ad.publishDate)).getMonth() + 1
      );

      const remainingDays = differenceInDays(expirationDate, new Date());
      const isExpired = remainingDays <= 0;

      return {
        ...ad,
        remaining: isExpired ? "Expired" : `${remainingDays} days`,
        status: isExpired ? "Inactive" : "Active",
      };
    });

    setCalculatedAds(updatedAds);
  }, [ads]);

  const sortedAds = [...calculatedAds].sort((a, b) => {
    if (sortConfig.key === "status") {
      if (a.status === "Active" && b.status !== "Active") return -1;
      if (b.status === "Active" && a.status !== "Active") return 1;
    }

    if (sortConfig.key === "date") {
      const dateA = new Date(a.publishDate);
      const dateB = new Date(b.publishDate);
      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    }

    if (sortConfig.key === "remaining") {
      const remA = a.remaining === "Expired" ? -1 : parseInt(a.remaining);
      const remB = b.remaining === "Expired" ? -1 : parseInt(b.remaining);
      return sortConfig.direction === "asc" ? remA - remB : remB - remA;
    }

    return 0;
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

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
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-4">Gambar</th>
            <th className="border-b p-4">Nama Advertising</th>
            <th
              className="border-b p-4 cursor-pointer"
              onClick={() => handleSort("date")}
            >
              <div className="flex items-center gap-2">
                Tanggal Publish {getSortIcon("date")}
              </div>
            </th>
            <th
              className="border-b p-4 cursor-pointer"
              onClick={() => handleSort("remaining")}
            >
              <div className="flex items-center gap-2">
                Remaining {getSortIcon("remaining")}
              </div>
            </th>
            <th className="border-b p-4">Space</th>
            <th
              className="border-b p-4 cursor-pointer"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center gap-2">
                Status {getSortIcon("status")}
              </div>
            </th>
            <th className="border-b p-4 w-32 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {sortedAds.map((ad) => (
            <tr key={ad.id} className="hover:bg-gray-50">
              {/* Gambar */}
              <td className="border-b p-4">
                <Image
                  src={ad.image || "/default-image.png"}
                  alt={ad.name}
                  width={50}
                  height={50}
                  className="rounded-md object-cover"
                />
              </td>

              {/* Nama Iklan */}
              <td className="border-b p-4">{ad.name}</td>

              {/* Tanggal Publish */}
              <td className="border-b p-4">{ad.publishDate}</td>

              {/* Remaining */}
              <td className="border-b p-4">
                {ad.remaining === "Expired" ? (
                  <span className="text-red-600">{ad.remaining}</span>
                ) : (
                  ad.remaining
                )}
              </td>

              {/* Space */}
              <td className="border-b p-4">{ad.space}</td>

              {/* Status */}
              <td className="border-b p-4">
                <span
                  className={`px-2 py-1 rounded-md text-xs ${
                    ad.status === "Active"
                      ? "bg-green-200 text-green-700"
                      : "bg-red-200 text-red-700"
                  }`}
                >
                  {ad.status}
                </span>
              </td>

              {/* Aksi: Edit, Hapus, Preview */}
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdvertisingTable;
