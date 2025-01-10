"use client";
import React, { useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import Image from "next/image";

const PendingUserTable = ({ pendingUsers, onApprove, onReject }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectUserId, setRejectUserId] = useState(null);

  const openRejectPopup = (userId) => {
    setRejectUserId(userId);
    setIsPopupOpen(true);
  };

  const closeRejectPopup = () => {
    setRejectReason("");
    setRejectUserId(null);
    setIsPopupOpen(false);
  };

  const confirmReject = () => {
    if (rejectReason.trim() === "") {
      alert("Masukkan alasan penolakan terlebih dahulu.");
      return;
    }
    onReject(rejectUserId, rejectReason);
    closeRejectPopup();
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <table className="w-full text-left border-collapse ">
        <thead>
          <tr>
            <th className="border-b p-4">Foto</th>
            <th className="border-b p-4">Nama</th>
            <th className="border-b p-4">Email</th>
            <th className="border-b p-4">No Handphone</th>
            <th className="border-b p-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {pendingUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="border-b p-4">
                <Image
                  src={user.photo}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </td>
              <td className="border-b p-4">{user.name}</td>
              <td className="border-b p-4">{user.email}</td>
              <td className="border-b p-4">{user.phone}</td>
              <td className="border-b p-4 py-10 flex gap-4">
                <button
                  className="text-green-500 hover:text-green-700 transition-all"
                  onClick={() => onApprove(user.id)}
                  title="Setujui"
                >
                  <AiOutlineCheck size={20} />
                </button>
                <button
                  className="text-red-500 hover:text-red-700 transition-all"
                  onClick={() => openRejectPopup(user.id)}
                  title="Tolak"
                >
                  <AiOutlineClose size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isPopupOpen && (
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

export default PendingUserTable;
