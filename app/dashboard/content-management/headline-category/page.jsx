"use client";
import React, { useState, useEffect } from "react";
import { useBackend } from "@/context/BackContext";
import ArticlePopup from "@/components/ArticlePopup";
import ArticleList from "@/components/ArticleList";
import NotifHeadEditor from "@/components/NotifHeadEditor";
import ArticleListSkeleton from "@/components/ArticleListSkeleton";

import Image from "next/image";
import {
  FaArrowUp,
  FaArrowDown,
  FaExchangeAlt,
  FaRegTrashAlt,
} from "react-icons/fa";

const HeadlineByCategoryPage = () => {
  const {
    selectedPortal,
    getHeadlines,
    saveHeadlines,
    getArticlesByCategory,
    articles,
    getCategoriesByPlatformId,
  } = useBackend();

  // const categories = [
  //   "ENTERTAINTMENT",
  //   "TECHNOLOGY",
  //   "SPORT",
  //   "C-LEVEL",
  //   "LIFESTYLE",
  // ];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [headlines, setHeadlines] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentReplaceIndex, setCurrentReplaceIndex] = useState(null);
  const [notification, setNotification] = useState(null);
  const [categories, setCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState(null);

  const articlesPerPage = 10;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeadlines = async () => {
      if (!selectedPortal?.platform_id || !selectedCategory) return;
  
      setIsLoading(true);
      setHeadlines([]); // 🔥 RESET DULU headline lama
  
      try {
        const data = await getHeadlines(selectedPortal.platform_id, selectedCategory);
        const mapped = data
          .map((item) => ({
            position: item.position,
            article_id: item.article?.article_id || item.article_id,
            title: item.article?.title || "No Title",
            image: item.article?.image || "/placeholder-image.jpg",
            date: item.article?.date || "-",
            author: item.article?.author?.fullname || "Unknown",
          }))
          .sort((a, b) => a.position - b.position);
  
        setHeadlines(mapped);
      } catch (error) {
        console.error("❌ Gagal mengambil headlines:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchHeadlines();
  }, [selectedCategory, selectedPortal?.platform_id]);
  

  useEffect(() => {
    const fetchCategories = async () => {
      if (!selectedPortal?.platform_id) return;
  
      try {
        const result = await getCategoriesByPlatformId(selectedPortal.platform_id);
        setCategories(result); // simpan ke state
  
        if (result.length > 0) {
          setSelectedCategory(result[0].category_name); // ✅ pakai nama kategori dari backend
          setCurrentPage(1); // reset pagination
        }
      } catch (err) {
        console.error("❌ Gagal ambil kategori:", err);
      }
    };
  
    fetchCategories();
  }, [selectedPortal?.platform_id]);
  
  
  
  

  useEffect(() => {
    const fetchArticles = async () => {
      if (!selectedPortal?.platform_id) return;

      try {
        const response = await getArticlesByCategory(
          selectedPortal.platform_id,
          selectedCategory,
          currentPage,
          articlesPerPage
        );

        setMeta(response?.meta || {});
      } catch (error) {
        console.error("❌ Gagal mengambil artikel:", error);
      }
    };

    fetchArticles();
  }, [selectedPortal?.platform_id, selectedCategory, currentPage]);

  const filteredArticles = articles.filter(
    (a) =>
      a.platform_id === selectedPortal?.platform_id &&
      (
        (Array.isArray(a.category) && a.category.includes(selectedCategory)) ||
        (typeof a.category === "string" && a.category === selectedCategory)
      )
  );
  

  const addHeadline = (article) => {
    setHeadlines((prev) => {
      const exist = prev.some(
        (item) =>
          item.article_id === article.article_id || item._id === article._id
      );
      if (!exist && prev.length < 5) return [...prev, article];
      return prev;
    });
  };

  const removeHeadline = (id) => {
    setHeadlines((prev) =>
      prev.filter((item) => item.article_id !== id && item._id !== id)
    );
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...headlines];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setHeadlines(updated);
  };

  const moveDown = (index) => {
    if (index === headlines.length - 1) return;
    const updated = [...headlines];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setHeadlines(updated);
  };

  const openReplacePopup = (index) => {
    setCurrentReplaceIndex(index);
    setIsPopupOpen(true);
  };

  const closeReplacePopup = () => {
    setCurrentReplaceIndex(null);
    setIsPopupOpen(false);
  };

  const replaceHeadline = (article) => {
    setHeadlines((prev) => {
      const isDuplicate = prev.some(
        (item) => item.article_id === article.article_id
      );
      if (isDuplicate) {
        setNotification({
          type: "error",
          message: `Artikel "${article.title}" sudah ada di daftar!`,
        });
        return prev;
      }
      const updated = [...prev];
      updated[currentReplaceIndex] = article;
      return updated;
    });
    closeReplacePopup();
  };

  const handleSave = async () => {
    if (headlines.length === 0) {
      setNotification({
        type: "error",
        message: "❌ Tidak ada headline yang dipilih!",
      });
      return;
    }

    try {
      await saveHeadlines(headlines, selectedCategory);
      setNotification({
        type: "success",
        message: "✅ Headline berhasil disimpan!",
      });
    } catch (error) {
      setNotification({
        type: "error",
        message: "❌ Gagal menyimpan headline!",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
    window.location.reload();
  };

  const totalPages = meta?.totalPages || 1;

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
      {categories.map((cat) => (
  <button
    key={cat.id}
    onClick={() => {
      setSelectedCategory(cat.category_name);
      setCurrentPage(1);
    }}
    className={`${
      selectedCategory === cat.category_name
        ? "font-bold p-4 bg-blue-500 text-white rounded-lg"
        : "border border-gray-400 p-4 rounded-lg text-gray-800"
    }`}
  >
    {cat.category_name}
  </button>
))}

      </div>
      <div className="w-full h-[1px] bg-gray-300 mb-6"></div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {headlines.map((item, index) => (
          <div key={item.article_id} className="border rounded p-4 shadow">
            <div className="relative w-full h-32">
              <Image
                src={item.image || "/placeholder-image.jpg"}
                alt={item.title}
                fill
                className="object-cover rounded"
              />
            </div>
            <h3 className="mt-2 text-sm font-bold">{item.title}</h3>
            <div className="flex justify-between items-center mt-2">
              <div className="flex gap-2">
                <button onClick={() => moveUp(index)}>
                  <FaArrowUp />
                </button>
                <button onClick={() => moveDown(index)}>
                  <FaArrowDown />
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openReplacePopup(index)}>
                  <FaExchangeAlt />
                </button>
                <button
                  onClick={() => removeHeadline(item.article_id)}
                  className="text-red-500"
                >
                  <FaRegTrashAlt />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">📚 Pilih Artikel</h2>

        {isLoading ? (
          <ArticleListSkeleton count={articlesPerPage} />
        ) : (
          <ArticleList articles={filteredArticles} onAdd={addHeadline} />
        )}

        <div className="mt-4 flex justify-between items-center">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          Simpan Headline
        </button>
      </div>

      {isPopupOpen && (
        <ArticlePopup
          articles={filteredArticles}
          meta={meta}
          onClose={closeReplacePopup}
          onSelect={replaceHeadline}
          onPageChange={(page) => setCurrentPage(page)}
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

export default HeadlineByCategoryPage;
