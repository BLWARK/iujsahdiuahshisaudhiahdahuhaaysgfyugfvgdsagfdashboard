"use client";
import React, { useState, useEffect } from "react";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { useBackend } from "@/context/BackContext";
import { useRouter } from "next/navigation";
import he from "he";
import ArticlePreviewModal from "@/components/ArticlePreviewModal";
import Swal from "sweetalert2";

const ArticleTable = () => {
  const {
    articles,
    getAuthorArticles,
    getArticles,
    selectedPortal,
    user,
    getArticleById,
    handleEditArticle,
    deleteArticleById,
    markArticleAsDeleted,
    authorArticlesMeta,
  } = useBackend();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [previewData, setPreviewData] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const router = useRouter();
  const articlesPerPage = 15;

  useEffect(() => {
    if (selectedPortal?.platform_id && user?.user_id) {
      setIsLoading(true);
      getAuthorArticles(currentPage, sortColumn, sortOrder)
        .then(() => setIsLoading(false))
        .catch((err) => {
          console.error("❌ Gagal memuat artikel:", err);
          setIsLoading(false);
        });
    }
  }, [selectedPortal, user, currentPage, sortColumn, sortOrder]);

  const filteredArticles = Array.isArray(articles)
    ? articles.filter(
        (article) =>
          article.platform_id === selectedPortal?.platform_id &&
          article.author_id === user?.user_id
      )
    : [];

  const sortedArticles = filteredArticles.sort((a, b) => {
    const valueA = a[sortColumn];
    const valueB = b[sortColumn];

    if (sortColumn === "date") {
      return sortOrder === "asc"
        ? new Date(valueA) - new Date(valueB)
        : new Date(valueB) - new Date(valueA);
    }

    if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
    if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = authorArticlesMeta?.totalPages || 1;

  const currentArticles = articles;

  const handlePageChange = (page) => setCurrentPage(page);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const getSortIcon = (column) => {
    if (sortColumn === column) {
      return sortOrder === "asc" ? (
        <AiOutlineSortAscending size={16} />
      ) : (
        <AiOutlineSortDescending size={16} />
      );
    }
    return <AiOutlineSortAscending size={16} className="text-gray-400" />;
  };

  const handleView = async (articleId) => {
    try {
      const data = await getArticleById(articleId);
      setPreviewData({
        ...data,
        content: he.decode(data.content || ""),
      });
      setIsPreviewOpen(true);
    } catch (err) {
      console.error("❌ Gagal ambil artikel:", err);
    }
  };

  const handleEdit = (articleId) => handleEditArticle(articleId, router);

  const handleDelete = async (articleId) => {
    const result = await Swal.fire({
      title: "Yakin hapus artikel?",
      text: "Artikel akan ditandai sebagai 'deleted'.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await markArticleAsDeleted(articleId);
      await getArticles(selectedPortal.platform_id);
      Swal.fire("Sukses", "Artikel berhasil dihapus.", "success");
    } catch (err) {
      console.error("❌ Gagal ubah status artikel:", err);
      Swal.fire("Error", "Gagal menghapus artikel.", "error");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="bg-white p-6 rounded-md shadow-md w-full ">
      <h2 className="text-2xl font-bold mb-6">
        Daftar Artikel - {selectedPortal?.platform_name || "Pilih Portal"}
      </h2>
      <div className="2xl:w-full xl:w-full lg:w-full w-[300px] overflow-x-scroll">
        <table className="min-w-full table-auto text-left border">
          <thead>
            <tr className="bg-gray-100">
              {[
                { label: "#", key: "index" },
                { label: "Judul", key: "title" },
                { label: "Kategori", key: "category" },
                { label: "Tanggal", key: "date" },
                { label: "Status", key: "status" },
                // { label: "Approved/Rejected By", key: "approved_by" },
                { label: "Aksi", key: "action" },
              ].map(({ label, key }) => (
                <th
                  key={key}
                  className="border px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() =>
                    key !== "index" && key !== "action" && handleSort(key)
                  }
                >
                  <div className="flex items-center gap-1">
                    {label} {getSortIcon(key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentArticles.map((article, index) => (
              <tr key={article._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">
                  {index + 1 + (currentPage - 1) * articlesPerPage}
                </td>
                <td className="border px-4 py-2">{article.title}</td>
                <td className="border px-4 py-2">
                  {Array.isArray(article.category)
                    ? article.category.join(", ")
                    : article.category || "No Category"}
                </td>
                <td className="border px-4 py-2">
                  {new Date(article.date).toLocaleDateString()}
                </td>
                <td
                  className={`border px-4 py-2 font-semibold whitespace-nowrap ${
                    article.status === "Publish"
                      ? "text-green-600"
                      : article.status === "Reject"
                      ? "text-red-600"
                      : "text-orange-500"
                  }`}
                >
                  {article.status}
                </td>
                {/* <td className="border px-4 py-2 whitespace-nowrap">
                  {article.approved_by || "-"}
                </td> */}
                <td className="border px-4 py-2 whitespace-nowrap">
                  <div className="flex gap-2 justify-center">
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() => handleView(article.article_id)}
                      title="Lihat"
                    >
                      <AiOutlineEye size={20} />
                    </button>
                    <button
                      onClick={() => handleEdit(article.article_id)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit Draft"
                    >
                      <AiOutlineEdit size={20} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(article.article_id)}
                      title="Hapus Artikel"
                    >
                      <AiOutlineDelete size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-between">
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

      {isPreviewOpen && previewData && (
        <ArticlePreviewModal
          article={previewData}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
};

export default ArticleTable;
