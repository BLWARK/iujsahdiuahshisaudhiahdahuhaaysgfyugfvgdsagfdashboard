"use client";

import React, { useState } from "react";
import {
  AiOutlineEye,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import Image from "next/image";

const PendingAdsTable = ({ ads }) => {
  const [pendingAds, setPendingAds] = useState(ads);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // ✅ Approve Iklan
  const handleApprove = (id) => {
    const updatedAds = pendingAds.filter((ad) => ad.id !== id);
    setPendingAds(updatedAds);
    alert("Iklan berhasil disetujui!");
  };

  // ✅ Buka Modal Penolakan
  const handleRejectClick = (id) => {
    setSelectedAdId(id);
    setIsRejectModalOpen(true);
  };

  // ✅ Submit Alasan Penolakan
  const handleRejectSubmit = () => {
    if (rejectionReason.trim() === "") {
      alert("Mohon isi alasan penolakan.");
      return;
    }

    const updatedAds = pendingAds.filter((ad) => ad.id !== selectedAdId);
    setPendingAds(updatedAds);
    setIsRejectModalOpen(false);
    alert(`Iklan ditolak! Alasan: ${rejectionReason}`);
    setRejectionReason("");
  };

  // ✅ Tutup Modal Penolakan
  const handleCloseModal = () => {
    setIsRejectModalOpen(false);
    setRejectionReason("");
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        📝 Daftar Iklan Menunggu Persetujuan
      </h2>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-4">Gambar</th>
            <th className="border-b p-4">Nama Iklan</th>
            <th className="border-b p-4">Tanggal Submit</th>
            <th className="border-b p-4">Space</th>
            <th className="border-b p-4">Status</th>
            <th className="border-b p-4 w-32 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {pendingAds.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                Tidak ada iklan yang menunggu persetujuan.
              </td>
            </tr>
          ) : (
            pendingAds.map((ad) => (
              <tr key={ad.id} className="hover:bg-gray-50">
                <td className="border-b p-4">
                  <Image
                    src={ad.image || "/default-image.png"}
                    alt={ad.name}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                </td>
                <td className="border-b p-4">{ad.name}</td>
                <td className="border-b p-4">{ad.submitDate}</td>
                <td className="border-b p-4">{ad.space}</td>
                <td className="border-b p-4">
                  <span className="px-2 py-1 rounded-md text-xs bg-yellow-200 text-yellow-700">
                    {ad.status}
                  </span>
                </td>
                <td className="border-b p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      title="Preview"
                      className="text-blue-500 hover:text-blue-700 transition"
                    >
                      <AiOutlineEye size={20} />
                    </button>
                    <button
                      title="Approve"
                      className="text-green-500 hover:text-green-700 transition"
                      onClick={() => handleApprove(ad.id)}
                    >
                      <AiOutlineCheckCircle size={20} />
                    </button>
                    <button
                      title="Reject"
                      className="text-red-500 hover:text-red-700 transition"
                      onClick={() => handleRejectClick(ad.id)}
                    >
                      <AiOutlineCloseCircle size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ✅ Modal Penolakan */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h3 className="text-lg font-semibold mb-4">
              Alasan Penolakan Iklan
            </h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Masukkan alasan penolakan..."
              rows="4"
              className="w-full p-2 border rounded-md"
            ></textarea>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              >
                Batal
              </button>
              <button
                onClick={handleRejectSubmit}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Tolak Iklan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingAdsTable;
