"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import {
  formatDistanceToNow,
  isToday,
  isYesterday,
  differenceInDays,
  parseISO,
} from "date-fns";
import { id } from "date-fns/locale"; // untuk Bahasa Indonesia

import Swal from "sweetalert2";
import { useBackend } from "@/context/BackContext";
import ArticlePreviewModal from "@/components/ArticlePreviewModal"; // ✅ pakai komponen modal buatanmu

const ArticlePublishTable = () => {
  const {
    selectedPortal,
    getArticlesPublish,
    setSelectedPortal,
    articles,
    handleEditArticle,
    deleteArticleById,
    getArticleById,
  } = useBackend();

  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const articlesPerPage = 10;

  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  const [viewedArticle, setViewedArticle] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isFetchingArticle, setIsFetchingArticle] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const storedPortal = JSON.parse(localStorage.getItem("selectedPortal"));
    if (!selectedPortal && storedPortal) setSelectedPortal(storedPortal);

    if (storedPortal?.platform_id) {
      getArticlesPublish(storedPortal.platform_id, currentPage, articlesPerPage)
        .then((response) => setMeta(response.meta))
        .catch((err) =>
          console.error("❌ Error fetching published articles:", err)
        );
    }
  }, [selectedPortal, currentPage]);

  const totalPages = meta ? meta.totalPages : 1;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <AiOutlineSortAscending size={16} />
      ) : (
        <AiOutlineSortDescending size={16} />
      );
    }
    return <AiOutlineSortAscending size={16} className="text-gray-400" />;
  };

  const sortedArticles = [...articles].sort((a, b) => {
    let valueA, valueB;
    if (sortConfig.key === "title") {
      valueA = a.title || "";
      valueB = b.title || "";
    } else if (sortConfig.key === "author") {
      valueA = a.author?.username || "";
      valueB = b.author?.username || "";
    } else if (sortConfig.key === "date") {
      valueA = new Date(a.date);
      valueB = new Date(b.date);
    }

    if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleView = async (articleId) => {
    setIsFetchingArticle(true);
    try {
      const fullArticle = await getArticleById(articleId);
      setViewedArticle(fullArticle);
      setIsPopupOpen(true);
    } catch (err) {
      console.error("❌ Gagal mengambil detail artikel:", err);
      alert("Gagal mengambil detail artikel.");
    } finally {
      setIsFetchingArticle(false);
    }
  };

  const handleDelete = async (articleId) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Aksi ini tidak bisa dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteArticleById(articleId);
        Swal.fire("Dihapus!", "Artikel berhasil dihapus.", "success");
        const res = await getArticlesPublish(
          selectedPortal.platform_id,
          currentPage,
          articlesPerPage
        );
        setMeta(res.meta);
      } catch (err) {
        console.error("❌ Gagal hapus:", err);
        Swal.fire("Gagal!", "Artikel gagal dihapus.", "error");
      }
    }
  };

  return (
    <div>
      <table className="2xl:w-full xl:w-full lg:w-full w-[380px] text-left border-collapse overflow-x-scroll">
        <thead>
          <tr>
            <th className="border-b p-4"></th>
            <th
              className="border-b p-4 cursor-pointer"
              onClick={() => handleSort("title")}
            >
              <div className="flex items-center gap-1">
                Judul {getSortIcon("title")}
              </div>
            </th>
            <th
              className="border-b p-4 cursor-pointer"
              onClick={() => handleSort("author")}
            >
              <div className="flex items-center gap-1">
                Penulis {getSortIcon("author")}
              </div>
            </th>
            <th
              className="border-b p-4 cursor-pointer"
              onClick={() => handleSort("date")}
            >
              <div className="flex items-center gap-1">
                Tanggal {getSortIcon("date")}
              </div>
            </th>
            <th className="border-b p-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {sortedArticles.map((article) => (
            <tr key={article.article_id} className="hover:bg-gray-50">
              <td className="border-b p-4">
                <button
                  className="text-green-500 hover:text-green-700"
                  onClick={() => handleView(article.article_id)}
                  title="Lihat"
                >
                  <AiOutlineEye size={20} />
                </button>
              </td>
              <td className="border-b p-4">{article.title}</td>
              <td className="border-b p-4">
                {article.author?.username || "Tidak Diketahui"}
              </td>
              <td className="border-b p-4">
                {(() => {
                  const date = new Date(article.date);
                  if (isToday(date)) {
                    return "Hari ini";
                  } else if (isYesterday(date)) {
                    return "Kemarin";
                  } else if (differenceInDays(new Date(), date) <= 2) {
                    return formatDistanceToNow(date, {
                      addSuffix: true,
                      locale: id,
                    });
                  } else {
                    return date.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short", // Jan, Feb, Mar, dst.
                      year: "numeric",
                    });
                  }
                })()}
              </td>

              <td className="border-b p-4 flex gap-2">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handleEditArticle(article.article_id, router)}
                >
                  <AiOutlineEdit size={20} />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(article.article_id)}
                  title="Hapus"
                >
                  <AiOutlineDelete size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Next
        </button>
      </div>

      {/* ✅ Gunakan Komponen Modal */}
      {isPopupOpen && viewedArticle && (
        <ArticlePreviewModal
          article={viewedArticle}
          onClose={() => setIsPopupOpen(false)}
        />
      )}

      {/* Optional Spinner */}
      {isFetchingArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white px-8 py-4 rounded shadow text-center">
            <p>⏳ Mengambil artikel...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlePublishTable;
