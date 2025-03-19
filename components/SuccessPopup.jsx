"use client";
import React from "react";

const SuccessPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Tidak render jika tidak dibuka

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-md text-center">
        <h2 className="text-lg font-bold mb-4">✅ Artikel Berhasil Dikirim!</h2>
        <p className="text-gray-600">Artikel Anda telah berhasil dikirim untuk direview.</p>
        <button onClick={onClose} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md">
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessPopup;
