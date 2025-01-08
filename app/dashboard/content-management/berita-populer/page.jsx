"use client";
import React, { useState } from "react";
import { articles } from "@/data/articles";
import ArticlePopup from "@/components/ArticlePopup";
import ArticleList from "@/components/ArticleList";
import { FaArrowUp, FaArrowDown, FaExchangeAlt, FaRegTrashAlt } from "react-icons/fa";

const PopularNewsPage = () => {
  const [editorChoices, setEditorChoices] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentReplaceIndex, setCurrentReplaceIndex] = useState(null);

  // Menambahkan Artikel ke Editor's Choice
  const addToEditorChoices = (article) => {
    if (!editorChoices.find((item) => item.id === article.id)) {
      setEditorChoices([...editorChoices, article]);
    }
  };

  // Menghapus Artikel dari Editor's Choice
  const removeFromEditorChoices = (id) => {
    setEditorChoices(editorChoices.filter((item) => item.id !== id));
  };

  // Mengatur Urutan Artikel ke Atas
  const moveUp = (index) => {
    if (index === 0) return;
    const updatedChoices = [...editorChoices];
    [updatedChoices[index], updatedChoices[index - 1]] = [
      updatedChoices[index - 1],
      updatedChoices[index],
    ];
    setEditorChoices(updatedChoices);
  };

  // Mengatur Urutan Artikel ke Bawah
  const moveDown = (index) => {
    if (index === editorChoices.length - 1) return;
    const updatedChoices = [...editorChoices];
    [updatedChoices[index], updatedChoices[index + 1]] = [
      updatedChoices[index + 1],
      updatedChoices[index],
    ];
    setEditorChoices(updatedChoices);
  };

  // Menampilkan Popup untuk Ganti Artikel
  const openReplacePopup = (index) => {
    setCurrentReplaceIndex(index);
    setIsPopupOpen(true);
  };

  // Menutup Popup
  const closeReplacePopup = () => {
    setIsPopupOpen(false);
    setCurrentReplaceIndex(null);
  };

  // Mengganti Artikel di Editor's Choice
  const replaceArticle = (article) => {
    const updatedChoices = [...editorChoices];
    updatedChoices[currentReplaceIndex] = article;
    setEditorChoices(updatedChoices);
    closeReplacePopup();
  };

  return (
    <div className="p-6 space-y-8 relative">
      {/* Pilihan Editor */}
      <div className="border p-4 rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-bold mb-4">✨ Berita Populer</h2>
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
        <h2 className="text-xl font-bold mb-4">📚 Pilih Berita</h2>
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
