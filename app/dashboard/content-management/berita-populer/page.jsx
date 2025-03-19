"use client";

import React, { useState, useEffect } from "react";
import { FaArrowUp, FaArrowDown, FaExchangeAlt, FaRegTrashAlt } from "react-icons/fa";
import { usePortal } from "@/context/PortalContext"; // ✅ Import Context Portal
import { loadArticlesByPortal } from "@/utils/loadPortalData"; // ✅ Import loader artikel
import ArticlePopup from "@/components/ArticlePopup";
import ArticleList from "@/components/ArticleList";

const PopularNewsPage = () => {
  const { selectedPortal } = usePortal(); // ✅ Gunakan usePortal()
  const [articles, setArticles] = useState([]); // ✅ State untuk daftar artikel berdasarkan portal
  const [editorChoices, setEditorChoices] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentReplaceIndex, setCurrentReplaceIndex] = useState(null);

  // 🔄 Ambil artikel sesuai portal yang dipilih
  useEffect(() => {
    if (selectedPortal) {
      const portalArticles = loadArticlesByPortal(selectedPortal.id);
      setArticles(portalArticles);
    }
  }, [selectedPortal]); // ✅ Update otomatis ketika portal berubah

  const addToEditorChoices = (article) => {
    if (!editorChoices.find((item) => item.id === article.id)) {
      setEditorChoices([...editorChoices, article]);
    }
  };

  const removeFromEditorChoices = (id) => {
    setEditorChoices(editorChoices.filter((item) => item.id !== id));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const updatedChoices = [...editorChoices];
    [updatedChoices[index], updatedChoices[index - 1]] = [
      updatedChoices[index - 1],
      updatedChoices[index],
    ];
    setEditorChoices(updatedChoices);
  };

  const moveDown = (index) => {
    if (index === editorChoices.length - 1) return;
    const updatedChoices = [...editorChoices];
    [updatedChoices[index], updatedChoices[index + 1]] = [
      updatedChoices[index + 1],
      updatedChoices[index],
    ];
    setEditorChoices(updatedChoices);
  };

  const openReplacePopup = (index) => {
    setCurrentReplaceIndex(index);
    setIsPopupOpen(true);
  };

  const closeReplacePopup = () => {
    setIsPopupOpen(false);
    setCurrentReplaceIndex(null);
  };

  const replaceArticle = (article) => {
    const updatedChoices = [...editorChoices];
    updatedChoices[currentReplaceIndex] = article;
    setEditorChoices(updatedChoices);
    closeReplacePopup();
  };

  return (
    <div className="p-6 space-y-8 relative">
      {/* Berita Populer */}
      <div className="border p-4 rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-bold mb-4">🔥 Berita Populer - {selectedPortal?.name || "Pilih Portal"}</h2>
        <div className="grid grid-cols-4 gap-4">
          {editorChoices.map((choice, index) => (
            <div key={choice.id} className="border rounded-md p-4 shadow bg-white relative">
              <div className="relative w-full h-32">
                <img
                  src={choice.image}
                  alt={choice.title}
                  className="w-full h-full object-contain rounded-md"
                />
              </div>
              <h3 className="mt-2 text-sm font-bold">{choice.title}</h3>

              {/* Tombol Kontrol */}
              <div className="flex justify-between items-center mt-2">
                {/* Tombol Arrow di Kiri */}
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
                {/* Tombol Ganti dan Hapus di Kanan */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openReplacePopup(index)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaExchangeAlt size={18} />
                  </button>
                  <button
                    onClick={() => removeFromEditorChoices(choice.id)}
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
        <h2 className="text-xl font-bold mb-4">📚 Pilih Berita - {selectedPortal?.name || "Pilih Portal"}</h2>
        <ArticleList articles={articles} onAdd={addToEditorChoices} />
      </div>

      {/* Popup Ganti Artikel */}
      {isPopupOpen && (
        <ArticlePopup
          articles={articles}
          onClose={closeReplacePopup}
          onSelect={replaceArticle}
        />
      )}
    </div>
  );
};

export default PopularNewsPage;
