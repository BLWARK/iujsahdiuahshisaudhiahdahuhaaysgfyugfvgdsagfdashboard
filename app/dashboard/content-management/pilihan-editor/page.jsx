"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaArrowUp,
  FaArrowDown,
  FaExchangeAlt,
  FaRegTrashAlt,
} from "react-icons/fa";
import { useBackend } from "@/context/BackContext";
import ArticlePopup from "@/components/ArticlePopup";
import ArticleList from "@/components/ArticleList";

const EditorChoicePage = () => {
  const { selectedPortal, articles, getArticles } = useBackend();
  const [editorChoices, setEditorChoices] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentReplaceIndex, setCurrentReplaceIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [prevPlatformId, setPrevPlatformId] = useState(null);

  // 🔄 Ambil artikel berdasarkan platform_id hanya jika berubah
  useEffect(() => {
    if (!selectedPortal?.platform_id || prevPlatformId === selectedPortal.platform_id) return;

    setIsLoading(true);
    getArticles(selectedPortal.platform_id)
      .then(() => setPrevPlatformId(selectedPortal.platform_id)) // ✅ Simpan platform_id agar tidak looping
      .finally(() => setIsLoading(false));
  }, [selectedPortal]);

  // ✅ Filter artikel berdasarkan selectedPortal.platform_id
  const filteredArticles = articles.filter(
    (article) => article.platform_id === selectedPortal?.platform_id
  );

  const addToEditorChoices = (article) => {
    setEditorChoices((prevChoices) => {
      // 🔥 Cek apakah artikel sudah ada dalam daftar editorChoices berdasarkan _id atau article_id
      const isAlreadyAdded = prevChoices.some(
        (item) => item._id === article._id || item.article_id === article.article_id
      );

      if (!isAlreadyAdded && prevChoices.length < 5) { // ✅ Maksimum 5 artikel
        console.log("✅ Menambahkan artikel:", article.title);
        return [...prevChoices, article]; // Tambahkan artikel baru
      }

      console.log("❌ Artikel sudah ada atau limit 5 tercapai:", article.title);
      return prevChoices; // Jika sudah ada atau limit, tidak menambahkan lagi
    });
  };

  const removeFromEditorChoices = (id) => {
    setEditorChoices(editorChoices.filter((item) => item._id !== id && item.article_id !== id));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    setEditorChoices((prevChoices) => {
      const updatedChoices = [...prevChoices];
      [updatedChoices[index], updatedChoices[index - 1]] = [
        updatedChoices[index - 1],
        updatedChoices[index],
      ];
      return updatedChoices;
    });
  };

  const moveDown = (index) => {
    if (index === editorChoices.length - 1) return;
    setEditorChoices((prevChoices) => {
      const updatedChoices = [...prevChoices];
      [updatedChoices[index], updatedChoices[index + 1]] = [
        updatedChoices[index + 1],
        updatedChoices[index],
      ];
      return updatedChoices;
    });
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
    setEditorChoices((prevChoices) => {
      const updatedChoices = [...prevChoices];
      updatedChoices[currentReplaceIndex] = article;
      return updatedChoices;
    });
    closeReplacePopup();
  };

  return (
    <div className="p-6 space-y-8 relative">
      {/* Pilihan Editor */}
      <div className="border p-4 rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-bold mb-4">
          ✨ Pilihan Editor - {selectedPortal?.name || "Pilih Portal"}
        </h2>
        {isLoading ? (
          <p className="text-center text-gray-500">Loading artikel...</p>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {editorChoices.map((choice, index) => (
              <div
                key={choice._id || choice.article_id || `${choice.platform_id}-${index}`}
                className="border rounded-md p-4 shadow bg-white relative"
              >
                <div className="relative w-full h-32">
                  <Image
                    src={choice.image || "/placeholder-image.jpg"} // ✅ Gunakan gambar default jika kosong
                    alt={choice.title || "Gambar Tidak Tersedia"}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <h3 className="mt-2 text-sm font-bold">{choice.title}</h3>

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
                      onClick={() => removeFromEditorChoices(choice._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaRegTrashAlt size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Daftar Semua Artikel */}
      <div className="border p-4 rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-bold mb-4">
          📚 Pilih Berita - {selectedPortal?.name || "Pilih Portal"}
        </h2>
        {isLoading ? (
          <p className="text-center text-gray-500">Loading artikel...</p>
        ) : (
          <ArticleList articles={filteredArticles} onAdd={addToEditorChoices} />
        )}
      </div>

      {/* Popup Ganti Artikel */}
      {isPopupOpen && (
        <ArticlePopup
          articles={filteredArticles}
          onClose={closeReplacePopup}
          onSelect={replaceArticle}
        />
      )}
    </div>
  );
};

export default EditorChoicePage;
