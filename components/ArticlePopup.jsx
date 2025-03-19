"use client";
import React from "react";
import { IoClose } from "react-icons/io5";

const ArticlePopup = ({ articles, onClose, onSelect }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-1/2 max-h-[90vh] overflow-auto">
        <h2 className="text-lg font-bold mb-4">Ganti Artikel</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
        >
          <IoClose size={24} />
        </button>
        <ul className="space-y-2">
        {articles.map((article, index) => (
            <li
            key={article._id || article.article_id || `${article.platform_id}-${index}`}
              className="flex justify-between items-center p-2 border rounded-md hover:bg-gray-100"
            >
              <span className="text-sm">{article.title}</span>
              <button
                onClick={() => onSelect(article)}
                className="text-white bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-md text-sm"
              >
                Pilih
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ArticlePopup;
