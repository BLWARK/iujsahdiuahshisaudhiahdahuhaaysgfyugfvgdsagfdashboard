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

const HeadlinePage = () => {
  const { selectedPortal, articles, getArticles } = useBackend();
  const [headlines, setHeadlines] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentReplaceIndex, setCurrentReplaceIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [prevPlatformId, setPrevPlatformId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const articlesPerPage = 10; // Misal limit yang diminta backend

  // Ambil artikel berdasarkan platform_id dan halaman yang dipilih
  useEffect(() => {
    if (!selectedPortal?.platform_id) return;
    setIsLoading(true);
    getArticles(selectedPortal.platform_id, currentPage, articlesPerPage)
      .then((response) => {
        setMeta(response.meta);
        setPrevPlatformId(selectedPortal.platform_id);
      })
      .finally(() => setIsLoading(false));
  }, [selectedPortal, currentPage, getArticles]);

  // Filter artikel berdasarkan selectedPortal.platform_id
  const filteredArticles = articles.filter(
    (article) => article.platform_id === selectedPortal?.platform_id
  );

  // Sorting berdasarkan tanggal (descending: artikel terbaru di atas)
  const sortedFilteredArticles = [...filteredArticles].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  // Fungsi untuk menambahkan artikel ke daftar headlines (maksimal 5)
  const addToHeadlines = (article) => {
    setHeadlines((prevHeadlines) => {
      const isAlreadyAdded = prevHeadlines.some(
        (item) =>
          item._id === article._id || item.article_id === article.article_id
      );
      if (!isAlreadyAdded && prevHeadlines.length < 5) {
        console.log("✅ Menambahkan artikel:", article.title);
        return [...prevHeadlines, article];
      }
      console.log("❌ Artikel sudah ada atau limit 5 tercapai:", article.title);
      return prevHeadlines;
    });
  };

  const removeFromHeadlines = (id) => {
    setHeadlines(headlines.filter((item) => item._id !== id && item.article_id !== id));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    setHeadlines((prevHeadlines) => {
      const updatedHeadlines = [...prevHeadlines];
      [updatedHeadlines[index - 1], updatedHeadlines[index]] = [
        updatedHeadlines[index],
        updatedHeadlines[index - 1],
      ];
      return updatedHeadlines;
    });
  };

  const moveDown = (index) => {
    if (index === headlines.length - 1) return;
    setHeadlines((prevHeadlines) => {
      const updatedHeadlines = [...prevHeadlines];
      [updatedHeadlines[index], updatedHeadlines[index + 1]] = [
        updatedHeadlines[index + 1],
        updatedHeadlines[index],
      ];
      return updatedHeadlines;
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

  const replaceHeadline = (article) => {
    setHeadlines((prevHeadlines) => {
      const updatedHeadlines = [...prevHeadlines];
      updatedHeadlines[currentReplaceIndex] = article;
      return updatedHeadlines;
    });
    closeReplacePopup();
  };

  // Pagination controls
  const totalPages = meta ? meta.totalPages : 1;
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 space-y-8 relative">
      {/* Headline Artikel */}
      <div className="border p-4 rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-bold mb-4">
          🏆 Headline Artikel - {selectedPortal?.platform_name || "Pilih Portal"}
        </h2>
        {isLoading ? (
          <p className="text-center text-gray-500">Loading artikel...</p>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {headlines.map((headline, index) => (
              <div
                key={
                  headline._id ||
                  headline.article_id ||
                  `${headline.platform_id}-${index}`
                }
                className="border rounded-md p-4 shadow bg-white relative"
              >
                <div className="relative w-full h-32">
                  <Image
                    src={headline.image || "/placeholder-image.jpg"}
                    alt={headline.title || "Gambar Tidak Tersedia"}
                    width={300}
                    height={200}
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
        )}
      </div>

      {/* Daftar Semua Artikel dengan Pagination */}
      <div className="border p-4 rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-bold mb-4">
          📚 Pilih Berita - {selectedPortal?.platform_name || "Pilih Portal"}
        </h2>
        {isLoading ? (
          <p className="text-center text-gray-500">Loading artikel...</p>
        ) : (
          <>
            <ArticleList
              articles={sortedFilteredArticles}
              onAdd={addToHeadlines}
            />
            {/* Pagination Controls */}
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Popup Ganti Artikel */}
      {isPopupOpen && (
        <ArticlePopup
          articles={sortedFilteredArticles}
          onClose={closeReplacePopup}
          onSelect={replaceHeadline}
        />
      )}
    </div>
  );
};

export default HeadlinePage;
