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


const HeadlinePage = () => {
  const { selectedPortal, articles, getArticles, saveHeadlines, getHeadlines } =
    useBackend();

  const [headlines, setHeadlines] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentReplaceIndex, setCurrentReplaceIndex] = useState(null);
  const [notification, setNotification] = useState(null);

  // ✅ State loading terpisah
  const [isLoadingHeadlines, setIsLoadingHeadlines] = useState(true);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState(null);

  const articlesPerPage = 10;
  const hasFetched = useRef(false);

  // ✅ Fetch Headline hanya saat platform_id berubah (TIDAK TERPENGARUH Pagination)
  useEffect(() => {
    const fetchHeadlines = async () => {
      if (!selectedPortal?.platform_id || hasFetched.current) return;

      setIsLoadingHeadlines(true);

      try {
        console.log("✅ Fetching headlines...");
        const headlineData = await getHeadlines(selectedPortal.platform_id);

        const mappedHeadlines = headlineData.map((item) => ({
          position: item.position,
          article_id: item.article?.article_id || item.article_id,
          title: item.article?.title || "No Title",
          image: item.article?.image || "/placeholder-image.jpg",
          date: item.article?.date || "-",
          author: item.article?.author?.fullname || "Unknown Author",
          authorAvatar: item.article?.author?.avatar || "/default-avatar.png",
        }))
        .sort((a, b) => a.position - b.position);

        setHeadlines(mappedHeadlines);
        hasFetched.current = true;
      } catch (error) {
        console.error("❌ Error fetching headlines:", error);
      } finally {
        setIsLoadingHeadlines(false);
      }
    };

    fetchHeadlines();
  }, [selectedPortal?.platform_id, getHeadlines]); // ✅ TANPA `currentPage`!

  // ✅ Fetch Articles hanya saat currentPage berubah (TIDAK TERPENGARUH Kolom Headline)
  useEffect(() => {
    if (!selectedPortal?.platform_id) return;

    const fetchArticles = async () => {
      setIsLoadingArticles(true);

      try {
        console.log("✅ Fetching articles...");
        const response = await getArticles(
          selectedPortal.platform_id,
          currentPage,
          articlesPerPage
        );

        setMeta(response?.meta || {});
      } catch (error) {
        console.error("❌ Error fetching articles:", error);
      } finally {
        setIsLoadingArticles(false);
      }
    };

    fetchArticles();
  }, [selectedPortal?.platform_id, currentPage, getArticles]); // ✅ currentPage jadi trigger!

  // ✅ Jika platform berubah, reset ref agar fetch bisa dipanggil ulang
  useEffect(() => {
    if (selectedPortal?.platform_id) {
      hasFetched.current = false;
    }
  }, [selectedPortal?.platform_id]);

  // ✅ Filter artikel berdasarkan selectedPortal.platform_id
  const filteredArticles = articles.filter(
    (article) => article.platform_id === selectedPortal?.platform_id
  );

  // ✅ Sorting berdasarkan tanggal (descending: artikel terbaru di atas)
  const sortedFilteredArticles = [...filteredArticles].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // ✅ Fungsi untuk menambahkan artikel ke daftar headlines (maksimal 5)
  const addToHeadlines = (article) => {
    setHeadlines((prevHeadlines) => {
      const isAlreadyAdded = prevHeadlines.some(
        (item) => item.article_id === article.article_id
      );
      if (!isAlreadyAdded && prevHeadlines.length < 5) {
        return [...prevHeadlines, article];
      }
      return prevHeadlines;
    });
  };

  // ✅ Fungsi untuk menghapus headline
  const removeFromHeadlines = (id) => {
    setHeadlines((prevHeadlines) =>
      prevHeadlines.filter((item) => item.article_id !== id)
    );
  };

  // ✅ Pindahkan headline ke atas
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

  // ✅ Pindahkan headline ke bawah
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

    // ✅ Buka popup ganti headline → FIXED ✅
    const openReplacePopup = (index) => {
      setCurrentReplaceIndex(index);
      setIsPopupOpen(true);
    };

      // ✅ Tutup popup
  const closeReplacePopup = () => {
    setIsPopupOpen(false);
    setCurrentReplaceIndex(null);
  };

  // ✅ Ganti headline
  const replaceHeadline = (article) => {
    setHeadlines((prevHeadlines) => {
      const isDuplicate = prevHeadlines.some(
        (item) => item.article_id === article.article_id
      );
  
      if (isDuplicate) {
        setNotification({
          type: "error",
          message: `Artikel "${article.title}" sudah ada di daftar!`,
        });
        return prevHeadlines; // ❌ Jangan ubah state jika duplikat
      }
  
      // ✅ Jika tidak duplikat → lanjutkan replace
      const updatedHeadlines = [...prevHeadlines];
      updatedHeadlines[currentReplaceIndex] = article;
      return updatedHeadlines;
    });
  
    setIsPopupOpen(false);
  };
  
  // ✅ Simpan headlines ke backend
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
        message: "❌ Error saat menyimpan headline!",
      });
    }
  };
  

    // ✅ Fungsi untuk menutup popup notifikasi dan refresh halaman
    const handleCloseNotification = () => {
      setNotification(null);
      window.location.reload(); // ✅ Refresh halaman setelah menutup popup
    };

  // ✅ Pagination
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
          🏆 Headline Artikel -{" "}
          {selectedPortal?.platform_name || "Pilih Portal"}
        </h2>

        {isLoadingHeadlines ? (
          <ArticleListSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-4 gap-4">
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
                      onClick={() => removeFromHeadlines(headline.article_id)}
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
        {isLoadingArticles ? (
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
      <div className="mt-4">
        <button
          onClick={handleSaveHeadlines}
          className="px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-700"
        >
          Simpan
        </button>
      </div>

      {/* Popup Ganti Artikel */}
      {/* ✅ Komponen Popup */}
      {isPopupOpen && (
        <ArticlePopup
          articles={sortedFilteredArticles}
          meta={meta}
          onClose={() => setIsPopupOpen(false)}
          onSelect={replaceHeadline}
          onPageChange={handlePageChange} // ✅ Trigger parent → Fetch data baru
        />
      )}

{notification?.message && (
  <NotifHeadEditor
    message={notification.message}
    type={notification.type}
    onClose={() => setNotification(null)}
  />
)}

    </div>
  );
};

export default HeadlinePage;
