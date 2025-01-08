"use client";
import React from "react";

const ArticleList = ({ articles, onAdd }) => {
  return (
    <ul className="space-y-2 max-h-96 overflow-auto border-t pt-2">
      {articles.map((article) => (
        <li
          key={article.id}
          className="flex justify-between items-center p-2 border rounded-md hover:bg-gray-100"
        >
          <span className="text-sm">{article.title}</span>
          <button
            onClick={() => onAdd(article)}
            className="text-white bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-md text-sm"
          >
            Tambah
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ArticleList;
