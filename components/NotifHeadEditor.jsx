import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const NotifHeadEditor = ({ message, type = "success", onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative transition-all">
        <div className="flex items-center gap-3 mb-4">
          {type === "success" ? (
            <FaCheckCircle className="text-green-500" size={24} />
          ) : (
            <FaTimesCircle className="text-red-500" size={24} />
          )}
          <h2 className="text-lg font-semibold">
            {type === "success" ? "Berhasil!" : "Gagal!"}
          </h2>
        </div>

        <p className="text-sm text-gray-700 mb-4">{message}</p>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              type === "success"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotifHeadEditor;
