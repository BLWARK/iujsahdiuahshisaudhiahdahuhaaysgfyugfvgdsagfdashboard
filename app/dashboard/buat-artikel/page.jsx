"use client";
import React, { useState, useEffect } from "react";

import {
  AiOutlineSave,
  AiOutlineSend,
} from "react-icons/ai";
import { useBackend } from "@/context/BackContext";
import ArticleEditor from "@/components/ArticleEditor";
import { DateTime } from "luxon";
import SuccessPopup from "@/components/SuccessPopup"; // ✅ Import Popup
import Swal from "sweetalert2";


const TambahArtikel = () => {
  const {
    articleData,
    updateArticleData,
    saveDraft,
    submitArticle,
    selectedPortal,
    getCategoriesByPlatformId,
    
  } = useBackend();
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [isSuccessPopupOpen, setSuccessPopupOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});


  
 
  // ✅ Pastikan `platform_id` terupdate dari `selectedPortal`
  useEffect(() => {
    if (selectedPortal?.platform_id) {
      console.log(
        "🔄 Memperbarui platform_id berdasarkan selectedPortal:",
        selectedPortal.platform_id
      );
      updateArticleData("platform_id", selectedPortal.platform_id);
    }
  }, [selectedPortal]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateArticleData("imageFile", file); // ✅ Simpan File asli untuk upload

      const reader = new FileReader();
      reader.onloadend = () => {
        updateArticleData("image", reader.result); // ✅ Simpan URL base64 untuk preview
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      if (selectedPortal?.platform_id) {
        console.log("✅ Fetching categories by platform_id...");
        const fetchedCategories = await getCategoriesByPlatformId(
          selectedPortal.platform_id
        );
        setCategories(fetchedCategories);
      }
    };

    fetchCategories();
  }, [selectedPortal?.platform_id]);

  // ✅ Fungsi untuk menghapus gambar
  const handleRemoveImage = () => {
    updateArticleData("image", ""); // Hapus URL gambar
    updateArticleData("imageFile", null); // Hapus file gambar
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    updateArticleData("title", newTitle);
    updateArticleData("slug", generateSlug(newTitle));
  };

  const handleSlugChange = (e) => {
    setIsSlugEdited(true);
    updateArticleData("slug", e.target.value);
  };

  const formatDateForInput = (isoString) => {
    if (!isoString) return "";
    return DateTime.fromISO(isoString).toFormat("yyyy-MM-dd'T'HH:mm");
  };

  const handleScheduledChange = (e) => {
    const selectedDate = e.target.value;
    const formattedISO = DateTime.fromFormat(
      selectedDate,
      "yyyy-MM-dd'T'HH:mm"
    ).toISO();
    updateArticleData("scheduled_at", formattedISO);
  };

  const [now, setNow] = useState("");

  useEffect(() => {
    const current = DateTime.now().toFormat("yyyy-MM-dd'T'HH:mm");
    setNow(current);
  }, []);
  
  // ✅ Pastikan platform_id ada sebelum submit
  const handleSubmitArticle = async () => {
    const {
      title,
      content,
      image,
      slug,
      meta_title,
      tags,
      // category,
      platform_id,
    } = articleData;
  
    // ✅ Cek semua field yang harus diisi
    if (
      !title ||
      !content ||
      !image ||
      !slug ||
      !meta_title ||
      !tags ||
      // !category?.length ||
      !platform_id
    ) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Semua field wajib diisi sebelum mengirim artikel!",
      });
      return;
    }
  
    try {
      await submitArticle();
      setSuccessPopupOpen(true); // ✅ Show popup kalau berhasil
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal Submit",
        text: err.message || "Terjadi kesalahan saat mengirim artikel.",
      });
    }
  };
  

  const handleClosePopup = () => {
    setSuccessPopupOpen(false);
    window.location.reload(); // 🔥 Force reload halaman setelah klik "OK"
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="block mb-2 font-bold text-lg">
              Judul Artikel:
            </label>
            <input
              type="text"
              value={articleData.title}
              onChange={handleTitleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">📝 Isi Artikel</h2>
            <ArticleEditor />
          </div>
        </div>

        {/* ✅ FORM GAMBAR */}
        <div>
          <h2 className="text-xl font-semibold mb-4">🖼️ Gambar Thumbnail</h2>
          <div className="border border-gray-300 rounded-md p-4">
            <div className="h-72 border-dashed border-2 border-gray-400 rounded-md flex justify-center items-center mb-4">
              {articleData.image ? (
                <img
                  src={
                    typeof articleData.image === "string"
                      ? articleData.image // ✅ Jika sudah URL
                      : URL.createObjectURL(articleData.image) // 🔥 Gunakan URL.createObjectURL() jika masih File
                  }
                  alt="Preview"
                  className="h-full w-full object-contain rounded-md"
                />
              ) : (
                <label className="cursor-pointer">
                  <span className="text-gray-500">
                    Drag and drop a file here or click
                  </span>
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              )}
            </div>

            {/* 🔥 Tombol Hapus Gambar */}

            <button
              onClick={handleRemoveImage}
              className=" top-2 right-2 bg-red-500 text-white p-3 mb-6 rounded-lg hover:bg-red-700"
            >
              Delete Images
            </button>

            {/* ✅ Tampilkan Nama File Gambar Jika Ada */}
            {articleData.image && typeof articleData.image !== "string" && (
              <p className="text-sm text-gray-600">
                📂 {articleData.image.name}
              </p>
            )}

            {/* ✅ Metadata Gambar */}
            <div className="space-y-2">
              <div>
                <label className="block font-medium">Alt Text:</label>
                <input
                  type="text"
                  value={articleData.image_alt || ""}
                  onChange={(e) =>
                    updateArticleData("image_alt", e.target.value)
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium">Title:</label>
                <input
                  type="text"
                  value={articleData.image_title || ""}
                  onChange={(e) =>
                    updateArticleData("image_title", e.target.value)
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium">Caption:</label>
                <input
                  type="text"
                  value={articleData.caption || ""}
                  onChange={(e) => updateArticleData("caption", e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Kategori:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={articleData.category?.includes(
                    category.category_name
                  )}
                  onChange={() => {
                    const updatedCategories = articleData.category?.includes(
                      category.category_name
                    )
                      ? articleData.category.filter(
                          (c) => c !== category.category_name
                        )
                      : [
                          ...(articleData.category || []),
                          category.category_name,
                        ];

                    updateArticleData("category", updatedCategories);
                  }}
                  className="w-4 h-4"
                />
                {category.category_name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Slug SEO:</label>
          <input
            type="text"
            value={articleData.slug}
            onChange={handleSlugChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Meta Data:</label>
          <input
            type="text"
            value={articleData.meta_title}
            onChange={(e) => updateArticleData("meta_title", e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-2 mt-4 font-medium">Tags:</label>
          <input
            type="text"
            value={articleData.tags}
            onChange={(e) => updateArticleData("tags", e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">🗓️ Jadwal Publikasi:</label>
          <input
            type="datetime-local"
            value={selectedDate || formatDateForInput(articleData.scheduled_at)}
            onChange={handleScheduledChange}
            min={now}
            className="p-2 border rounded-md"
          />
        </div>
      </div>

      <div className="flex justify-start items-center gap-4 text-nowrap">
        <button
          onClick={saveDraft}
          className="flex items-center gap-2 bg-gray-500 text-white px-4 py-3 rounded-md"
        >
          <AiOutlineSave size={18} /> Save to Draft
        </button>
        <button
          onClick={handleSubmitArticle}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-md"
        >
          <AiOutlineSend size={18} /> Submit Article
        </button>
      </div>
      {/* ✅ Gunakan Popup yang Sudah Dipisah */}
      <SuccessPopup isOpen={isSuccessPopupOpen} onClose={handleClosePopup} />
    </div>
  );
};

export default TambahArtikel;
