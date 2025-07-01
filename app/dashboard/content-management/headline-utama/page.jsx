"use client";
import React, { useState, useEffect, useRef } from "react";
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
import NotifHeadEditor from "@/components/NotifHeadEditor";
import ArticleListSkeleton from "@/components/ArticleListSkeleton";

const allowedIds = [1, 13, 14, 15, 16, 17];

const HeadlinePage = () => {
  const {
    selectedPortal,
    articles,
    getArticles,
    saveHeadlines,
    getHeadlines,
    platforms,
  } = useBackend();

  const regionalPortals = platforms.filter((p) =>
    allowedIds.includes(p.platform_id)
  );

  const [headlines, setHeadlines] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentReplaceIndex, setCurrentReplaceIndex] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isLoadingHeadlines, setIsLoadingHeadlines] = useState(true);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [filterPlatformId, setFilterPlatformId] = useState(1);

  const articlesPerPage = 10;
  const hasFetched = useRef(false);

  useEffect(() => {
  const fetchHeadlines = async () => {
    if (!selectedPortal?.platform_id) return;

    setIsLoadingHeadlines(true);

    try {
      const headlineData = await getHeadlines(selectedPortal.platform_id);
      const mapped = headlineData
        .map((item) => ({
          position: item.position,
          article_id: item.article?.article_id || item.article_id,
          title: item.article?.title || "No Title",
          image: item.article?.image || "/placeholder-image.jpg",
          date: item.article?.date || "-",
          author: item.article?.author?.fullname || "Unknown Author",
          authorAvatar: item.article?.author?.avatar || "/default-avatar.png",
        }))
        .sort((a, b) => a.position - b.position);

      setHeadlines(mapped);
    } catch (err) {
      console.error("Error fetching headlines:", err);
    } finally {
      setIsLoadingHeadlines(false);
    }
  };

  fetchHeadlines();
}, [selectedPortal?.platform_id]);


  useEffect(() => {
    if (!filterPlatformId) return;

    const fetchArticles = async () => {
      setIsLoadingArticles(true);
      try {
        const response = await getArticles(
          filterPlatformId,
          currentPage,
          articlesPerPage
        );
        setMeta(response?.meta || {});
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setIsLoadingArticles(false);
      }
    };

    fetchArticles();
  }, [filterPlatformId, currentPage]);

  useEffect(() => {
    hasFetched.current = false;
  }, [selectedPortal?.platform_id]);

  const filteredArticles = articles.filter(
    (article) =>
      article.platform_id === filterPlatformId && article.status === "publish"
  );

  const sortedFilteredArticles = [...filteredArticles].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const addToHeadlines = (article) => {
    setHeadlines((prev) => {
      const isAlreadyAdded = prev.some((i) => i.article_id === article.article_id);
      if (!isAlreadyAdded && prev.length < 5) return [...prev, article];
      return prev;
    });
  };

  const removeFromHeadlines = (id) => {
    setHeadlines((prev) => prev.filter((item) => item.article_id !== id));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    setHeadlines((prev) => {
      const updated = [...prev];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      return updated;
    });
  };

  const moveDown = (index) => {
    if (index === headlines.length - 1) return;
    setHeadlines((prev) => {
      const updated = [...prev];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      return updated;
    });
  };

  const openReplacePopup = (index) => {
  setCurrentReplaceIndex(index);
  setFilterPlatformId(selectedPortal.platform_id); // 🔥 Sync dengan portal aktif
  setCurrentPage(1); // optional: reset ke halaman pertama
  setIsPopupOpen(true);
};


  const replaceHeadline = (article) => {
    setHeadlines((prev) => {
      const isDuplicate = prev.some((i) => i.article_id === article.article_id);
      if (isDuplicate) {
        setNotification({
          type: "error",
          message: `Artikel \"${article.title}\" sudah ada di daftar!`,
        });
        return prev;
      }
      const updated = [...prev];
      updated[currentReplaceIndex] = article;
      return updated;
    });
    setIsPopupOpen(false);
  };

  const handleSaveHeadlines = async () => {
    if (headlines.length === 0) {
      setNotification({
        type: "error",
        message: "Tidak ada headline yang dipilih!",
      });
      return;
    }
    try {
      await saveHeadlines(headlines);
      setNotification({
        type: "success",
        message: "Headline berhasil disimpan!",
      });
    } catch (error) {
      setNotification({
        type: "error",
        message: "Error saat menyimpan headline!",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
    window.location.reload();
  };

  const totalPages = meta ? meta.totalPages : 1;
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="p-6 space-y-8 relative">
      <div className="border p-4 rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-bold mb-4">
          🏆 Headline Artikel - {selectedPortal?.platform_name || "Pilih Portal"}
        </h2>
        {isLoadingHeadlines ? (
          <ArticleListSkeleton count={4} />
        ) : (
          <div className="grid 2xl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-4 grid-cols-1 gap-4">
            {headlines.map((headline, index) => (
              <div
                key={headline.article_id}
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
                <div className="flex justify-between items-center mt-2">
                  <div className="flex gap-2">
                    <button onClick={() => moveUp(index)} className="text-gray-700 hover:text-gray-900">
                      <FaArrowUp size={18} />
                    </button>
                    <button onClick={() => moveDown(index)} className="text-gray-700 hover:text-gray-900">
                      <FaArrowDown size={18} />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openReplacePopup(index)} className="text-pink-500 hover:text-pink-700">
                      <FaExchangeAlt size={18} />
                    </button>
                    <button onClick={() => removeFromHeadlines(headline.article_id)} className="text-red-500 hover:text-red-700">
                      <FaRegTrashAlt size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border p-4 rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-bold mb-4">📚 Pilih Berita Berdasarkan Regional</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {regionalPortals.map((portal) => (
            <button
              key={portal.platform_id}
              onClick={() => {
                setFilterPlatformId(portal.platform_id);
                setCurrentPage(1);
              }}
              className={`px-3 py-2 rounded-md border text-sm ${
                filterPlatformId === portal.platform_id
                  ? "bg-pink-600 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
            >
              {portal.platform_desc}
            </button>
          ))}
        </div>

        {isLoadingArticles ? (
          <p className="text-center text-gray-500">Loading artikel...</p>
        ) : (
          <>
            <ArticleList articles={sortedFilteredArticles} onAdd={addToHeadlines} />
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
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

      <div className="mt-4">
        <button
          onClick={handleSaveHeadlines}
          className="px-6 py-3 bg-pink-500 text-white rounded-md shadow-md hover:bg-pink-700"
        >
          Simpan
        </button>
      </div>

      {isPopupOpen && (
  <ArticlePopup
    articles={sortedFilteredArticles}
    meta={meta}
    onClose={() => setIsPopupOpen(false)}
    onSelect={replaceHeadline}
    onPageChange={handlePageChange}
    // 🔥 Tambahkan props ini
    regionalPortals={regionalPortals}
    filterPlatformId={filterPlatformId}
    setFilterPlatformId={setFilterPlatformId}
  />
)}


      {notification?.message && (
        <NotifHeadEditor
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
    </div>
  );
};

export default HeadlinePage;