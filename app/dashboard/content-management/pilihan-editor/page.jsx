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
import NotifHeadEditor from "@/components/NotifHeadEditor"; // ✅ Import komponen baru

const EditorChoicePage = () => {
  const {
    selectedPortal,
    articles,
    getArticles,
    getEditorChoice,
    saveEditorChoice,
    platforms,
  } = useBackend();

  const [filterPlatformId, setFilterPlatformId] = useState(1); // default Nasional
  const allowedIds = [1, 13, 14, 15, 16, 17];
  const regionalPortals = platforms.filter((p) =>
    allowedIds.includes(p.platform_id)
  );

  const [fetchedArticles, setFetchedArticles] = useState([]);

  const [editorChoices, setEditorChoices] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentReplaceIndex, setCurrentReplaceIndex] = useState(null);
  const [notification, setNotification] = useState(null);

  // ✅ State loading terpisah
  const [isLoadingEditorChoices, setIsLoadingEditorChoices] = useState(true);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState(null);

  const articlesPerPage = 10;
  const hasFetched = useRef(false);

  // ✅ Fetch Editor Choices saat platform_id berubah (TIDAK TERPENGARUH Pagination)
  // useEffect(() => {
  //   const fetchEditorChoices = async () => {
  //     if (!filterPlatformId || hasFetched.current) return;

  //     setIsLoadingEditorChoices(true);

  //     try {
  //       const editorData = await getEditorChoice(filterPlatformId);
  //       const mapped = editorData
  //         .map((item) => ({
  //           position: item.position,
  //           article_id: item.article?.article_id || item.article_id,
  //           title: item.article?.title || "No Title",
  //           image: item.article?.image || "/placeholder-image.jpg",
  //           date: item.article?.date || "-",
  //           author: item.article?.author?.fullname || "Unknown Author",
  //           authorAvatar: item.article?.author?.avatar || "/default-avatar.png",
  //         }))
  //         .sort((a, b) => a.position - b.position);

  //       setEditorChoices(mapped);
  //       hasFetched.current = true;
  //     } catch (err) {
  //       console.error("Error fetching editor choices:", err);
  //     } finally {
  //       setIsLoadingEditorChoices(false);
  //     }
  //   };

  //   fetchEditorChoices();
  // }, [filterPlatformId]);


  useEffect(() => {
  const fetchEditorChoices = async () => {
    if (hasFetched.current) return;

    setIsLoadingEditorChoices(true);

    try {
      const editorData = await getEditorChoice(1); // 👈 Tetap platform_id = 1
      const mapped = Array.isArray(editorData)
        ? editorData.map((item) => ({
            position: item.position,
            article_id: item.article?.article_id || item.article_id,
            title: item.article?.title || "No Title",
            image: item.article?.image || "/placeholder-image.jpg",
            date: item.article?.date || "-",
            author: item.article?.author?.fullname || "Unknown Author",
            authorAvatar: item.article?.author?.avatar || "/default-avatar.png",
          })).sort((a, b) => a.position - b.position)
        : [];

      setEditorChoices(mapped);
      hasFetched.current = true;
    } catch (err) {
      console.error("Error fetching editor choices:", err);
    } finally {
      setIsLoadingEditorChoices(false);
    }
  };

  fetchEditorChoices();
}, []); // ⛔️ Hapus filterPlatformId dari depedensi


  // ✅ Fetch Articles saat currentPage berubah (TIDAK TERPENGARUH Kolom Atas)
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
        setFetchedArticles(response?.data || []);
        setMeta(response?.meta || {});
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setIsLoadingArticles(false);
      }
    };

    fetchArticles();
  }, [filterPlatformId, currentPage]);

  // ✅ Reset saat platform berubah
  useEffect(() => {
    hasFetched.current = false;
  }, [filterPlatformId]);

  // ✅ Filter artikel berdasarkan selectedPortal.platform_id
  const filteredArticles = articles.filter(
    (article) => article.platform_id === filterPlatformId
  );

  // ✅ Sorting berdasarkan tanggal (descending: artikel terbaru di atas)
  const sortedFilteredArticles = [...filteredArticles].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // ✅ Fungsi untuk menambahkan artikel ke daftar editorChoices (maksimal 5)
  const addToEditorChoices = (article) => {
    setEditorChoices((prevChoices) => {
      const isAlreadyAdded = prevChoices.some(
        (item) => item.article_id === article.article_id
      );
      if (!isAlreadyAdded && prevChoices.length < 5) {
        console.log("✅ Artikel ditambahkan:", article.title);
        return [...prevChoices, article];
      }
      console.log("❌ Artikel sudah ada atau limit tercapai");
      return prevChoices;
    });
  };

  // ✅ Fungsi untuk menghapus artikel dari editorChoices
  const removeFromEditorChoices = (id) => {
    setEditorChoices((prevChoices) =>
      prevChoices.filter((item) => item.article_id !== id)
    );
  };

  // ✅ Pindahkan artikel ke atas
  const moveUp = (index) => {
    if (index === 0) return;
    setEditorChoices((prevChoices) => {
      const updatedChoices = [...prevChoices];
      [updatedChoices[index - 1], updatedChoices[index]] = [
        updatedChoices[index],
        updatedChoices[index - 1],
      ];
      return updatedChoices;
    });
  };

  // ✅ Pindahkan artikel ke bawah
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

  // ✅ Ganti artikel (tambahkan validasi ID)
  const replaceArticle = (article) => {
    setEditorChoices((prevChoices) => {
      // ✅ Cek apakah article_id sudah ada di daftar yang sedang aktif
      const isAlreadyAdded = prevChoices.some(
        (item) => item.article_id === article.article_id
      );

      if (isAlreadyAdded) {
        console.log("❌ Artikel sudah ada di daftar editor choice");
        // ✅ Tampilkan notifikasi custom kalau artikel sudah ada
        setNotification({
          type: "error", // ✅ Bisa "success" atau "error"
          message: `Artikel "${article.title}" sudah ada di daftar!`,
        });
        return prevChoices; // ✅ Jangan ubah state jika ada duplikasi
      }

      // ✅ Jika ID unik → Lanjutkan penggantian artikel
      const updatedChoices = [...prevChoices];
      updatedChoices[currentReplaceIndex] = article;
      return updatedChoices;
    });

    setIsPopupOpen(false);
  };

  // ✅ Fungsi untuk menyimpan editorChoices ke backend
  const handleSaveEditorChoices = async () => {
    if (editorChoices.length === 0) {
      setNotification({
        type: "error",
        message: "Tidak ada editor choice yang dipilih!",
      });
      return;
    }

    try {
      await saveEditorChoice(editorChoices);
      setNotification({
        type: "success",
        message: "Editor Choices berhasil disimpan!",
      });
    } catch (error) {
      setNotification({
        type: "error",
        message: "❌ Error saat menyimpan editor choices.",
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
      {/* ✅ Editor Choice Section */}
      <div className="border p-4 rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-bold mb-4">
          ✨ Editor Choice - {selectedPortal?.platform_name || "Pilih Portal"}
        </h2>
        {isLoadingEditorChoices ? (
          <p className="text-center text-gray-500">Loading artikel...</p>
        ) : (
          <div className="grid 2xl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-4 grid-cols-1 gap-4">
           {editorChoices.slice(0, 4).map((choice, index) => (
              <div
                key={choice.article_id}
                className="border rounded-md p-4 shadow bg-white relative"
              >
                <div className="relative w-full h-32">
                  <Image
                    src={choice.image || "/placeholder-image.jpg"}
                    alt={choice.title || "Gambar Tidak Tersedia"}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <h3 className="mt-2 text-sm font-bold">{choice.title}</h3>
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
                      onClick={() => removeFromEditorChoices(choice.article_id)}
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
        

        <h2 className="text-2xl font-bold mb-4">
          ✨ Editor Choice 
        </h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {regionalPortals.map((portal) => (
            <button
              key={portal.platform_id}
              onClick={() => {
                setFilterPlatformId(portal.platform_id);
                setCurrentPage(1);
              }}
              className={`px-3 py-4 rounded-lg border text-sm ${
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
            <ArticleList
              articles={sortedFilteredArticles}
              onAdd={addToEditorChoices}
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
          onClick={handleSaveEditorChoices}
          className="px-6 py-3 bg-pink-500 text-white rounded-md shadow-md hover:bg-pink-700"
        >
          Simpan
        </button>
      </div>

      {/* ✅ Popup untuk mengganti artikel */}
      {isPopupOpen && (
       <ArticlePopup
  articles={[...fetchedArticles].sort((a, b) => new Date(b.date) - new Date(a.date))}
  meta={meta}
  onClose={() => setIsPopupOpen(false)}
  onSelect={replaceArticle}
  onPageChange={handlePageChange}
  regionalPortals={regionalPortals}
  filterPlatformId={filterPlatformId}
  setFilterPlatformId={setFilterPlatformId}
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

export default EditorChoicePage;
