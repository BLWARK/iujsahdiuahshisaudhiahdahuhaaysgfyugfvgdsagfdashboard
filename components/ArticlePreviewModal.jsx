"use client";
import React from "react";
import he from "he";
import { AiOutlineClose } from "react-icons/ai";

const ArticlePreviewModal = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white rounded-lg w-[90%] max-w-3xl shadow-lg relative p-6 max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <AiOutlineClose size={20} />
        </button>
        <h2 className="text-xl font-bold mb-2">{article.title}</h2>
        <p className="text-sm text-gray-600 mb-4">
          Ditulis oleh: {article.author?.username || "Tidak diketahui"}
        </p>
        <div className="mb-4">
              <img
                src={article.image || "/placeholder-image.jpg"}
                alt={article.title}
                className="w-full rounded-md"
              />
            </div>
        <div
          className="prose max-w-none
          [&_iframe]:w-full [&_iframe]:h-[400px] [&_iframe]:rounded-lg
            [&_p]:mb-4 
            [&_p]:leading-relaxed 
            [&_a]:text-blue-600 
            [&_a]:hover:underline 
            [&_a]:italic
            [&_table]:w-full 
            [&_table]:border 
            [&_th]:border 
            [&_td]:border 
            [&_td]:p-2 
            [&_th]:p-2 
            [&_thead]:bg-gray-100 
            [&_table]:my-6 
            [&_table]:text-sm
            [&_blockquote.tiktok-embed]:w-full [&_blockquote.tiktok-embed]:!max-w-full"
          dangerouslySetInnerHTML={{ __html: he.decode(article.content || "") }}
        />
      </div>
    </div>
  );
};

export default ArticlePreviewModal;
