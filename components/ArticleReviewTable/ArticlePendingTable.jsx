"use client";
import React, { useEffect, useState } from "react";
import {
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineCheck,
  AiOutlineClose,
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
import he from "he";
import { useRouter } from "next/navigation";
import { useBackend } from "@/context/BackContext";
import ArticlePreviewModal from "@/components/ArticlePreviewModal";

const ArticlePendingTable = () => {
  const {
    selectedPortal,
    articles,
    getArticlesPending,
    getArticleById,
    approveArticle,
    setArticles,
    handleEditArticle,
  } = useBackend();

  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [notification, setNotification] = useState("");
  const [previewArticle, setPreviewArticle] = useState(null);

  const router = useRouter();
  const articlesPerPage = 10;

  useEffect(() => {
    if (!selectedPortal?.platform_id) return;
    getArticlesPending(selectedPortal.platform_id, currentPage, articlesPerPage)
      .then((res) => setMeta(res?.meta))
      .catch((err) => console.error("❌ Gagal fetch artikel pending:", err));
  }, [selectedPortal, currentPage]);

  const fetchPendingArticles = () => {
    getArticlesPending(selectedPortal.platform_id, currentPage, articlesPerPage)
      .then((res) => setMeta(res?.meta))
      .catch((err) => console.error("❌ Gagal fetch artikel:", err));
  };

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
    let valueA = a[sortConfig.key];
    let valueB = b[sortConfig.key];

    if (sortConfig.key === "date") {
      valueA = new Date(a.date);
      valueB = new Date(b.date);
    } else if (sortConfig.key === "author") {
      valueA = a.author?.username || "";
      valueB = b.author?.username || "";
    } else {
      valueA = valueA || "";
      valueB = valueB || "";
    }

    if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleView = async (articleId) => {
    try {
      const data = await getArticleById(articleId);
      if (data?.content) {
        data.content = he.decode(data.content);
      }
      setPreviewArticle(data);
    } catch (err) {
      console.error("❌ Gagal menampilkan artikel:", err);
    }
  };

  const handleApprove = async (articleId) => {
    try {
      await approveArticle(articleId);
      const updated = articles.filter((a) => a.article_id !== articleId);
      setArticles(updated);
      setNotification("✅ Artikel berhasil disetujui!");
      fetchPendingArticles();
      setTimeout(() => setNotification(""), 3000);
    } catch (err) {
      console.error("❌ Gagal approve:", err);
      setNotification("❌ Gagal menyetujui artikel.");
    }
  };

  const handleReject = (articleId) => {
    Swal.fire("❌", "Logika penolakan belum diimplementasikan.", "info");
  };

  return (
    <div>
      {notification && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          {notification}
        </div>
      )}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-4">#</th>
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
          {sortedArticles.map((article, index) => (
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
                {article.author?.username || "-"}
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
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handleApprove(article.article_id)}
                  title="Approve"
                >
                  <AiOutlineCheck size={20} />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleReject(article.article_id)}
                  title="Tolak"
                >
                  <AiOutlineClose size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {previewArticle && (
        <ArticlePreviewModal
          article={previewArticle}
          onClose={() => setPreviewArticle(null)}
        />
      )}
    </div>
  );
};

export default ArticlePendingTable;
