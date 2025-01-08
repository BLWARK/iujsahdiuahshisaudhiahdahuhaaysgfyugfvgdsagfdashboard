"use client";
import React, { useState } from "react";
import { articles } from "@/data/articles";
import ArticlePopup from "@/components/ArticlePopup";
import ArticleList from "@/components/ArticleList";
import { FaArrowUp, FaArrowDown, FaExchangeAlt, FaRegTrashAlt } from "react-icons/fa";

const HeadlinePage = () => {
  const [headlines, setHeadlines] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentReplaceIndex, setCurrentReplaceIndex] = useState(null);

  const addToHeadlines = (article) => {
    if (!headlines.find((item) => item.id === article.id)) {
      setHeadlines([...headlines, article]);
    }
  };

  const removeFromHeadlines = (id) => {
    setHeadlines(headlines.filter((item) => item.id !== id));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const updatedHeadlines = [...headlines];
    [updatedHeadlines[index], updatedHeadlines[index - 1]] = [
      updatedHeadlines[index - 1],
      updatedHeadlines[index],
    ];
    setHeadlines(updatedHeadlines);
  };

  const moveDown = (index) => {
    if (index === headlines.length - 1) return;
    const updatedHeadlines = [...headlines];
    [updatedHeadlines[index], updatedHeadlines[index + 1]] = [
      updatedHeadlines[index + 1],
      updatedHeadlines[index],
    ];
    setHeadlines(updatedHeadlines);
  };

  const openReplacePopup = (index) => {
    setCurrentReplaceIndex(index);
    setIsPopupOpen(true);
  };

  const closeReplacePopup = () => {
    setIsPopupOpen(false);
    setCurrentReplaceIndex(null);
  };

  const replaceHeadline = (article) => {
    const updatedHeadlines = [...headlines];
    updatedHeadlines[currentReplaceIndex] = article;
    setHeadlines(updatedHeadlines);
    closeReplacePopup();
  };

  return (
    <div className="p-6 space-y-8 relative">
      {/* Headline Artikel */}
      <div className="border p-4 rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-bold mb-4">🏆 Headline Artikel</h2>
        <div className="grid grid-cols-4 gap-4">
          {headlines.map((headline, index) => (
            <div key={headline.id} className="border rounded-md p-4 shadow bg-white relative">
              <div className="relative w-full h-32">
                <img
                  src={headline.image}
                  alt={headline.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <h3 className="mt-2 text-sm font-bold">{headline.title}</h3>

              {/* Tombol Kontrol */}
              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => moveUp(index)}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    <FaArrowUp size={18} />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    <FaArrowDown size={18} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openReplacePopup(index)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaExchangeAlt size={18} />
                  </button>
                  <button
                    onClick={() => removeFromHeadlines(headline.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaRegTrashAlt size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daftar Semua Artikel */}
      <div className="border p-4 rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-bold mb-4">📚 Pilih Berita</h2>
        <ArticleList articles={articles} onAdd={addToHeadlines} />
      </div>

      {/* Popup Ganti Artikel */}
      {isPopupOpen && (
        <ArticlePopup
          articles={articles}
          onClose={closeReplacePopup}
          onSelect={replaceHeadline}
        />
      )}
    </div>
  );
};

export default HeadlinePage;
