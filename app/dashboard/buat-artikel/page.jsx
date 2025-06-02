"use client";
import React, { useState, useEffect } from "react";

import { AiOutlineSave, AiOutlineSend } from "react-icons/ai";
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
  const [isDescriptionEdited, setIsDescriptionEdited] = useState(false);

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
      .replace(/[^a-z\s-]/g, "") // ⛔ Hapus semua angka & karakter aneh
      .replace(/\s+/g, "-") // Ganti spasi dengan tanda hubung
      .replace(/-+/g, "-") // Gabungkan tanda minus berturut-turut
      .replace(/^-+|-+$/g, ""); // Hapus tanda minus di awal dan akhir
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

  useEffect(() => {
    if (!isDescriptionEdited && articleData.content) {
      const plainText = articleData.content
        .replace(/<[^>]*>?/gm, "") // hapus tag HTML
        .trim();

      const snippet = plainText.slice(0, 160); // ambil max 160 karakter
      updateArticleData("description", snippet);
    }
  }, [articleData.content]);

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
    const now = DateTime.now();
    const defaultSchedule = now.plus({ hours: 0 }).toISO(); // jadwal default +1 jam

    setNow(now.toFormat("yyyy-MM-dd'T'HH:mm"));

    // hanya set jika belum ada jadwal dari articleData
    if (!articleData.scheduled_at) {
      updateArticleData("scheduled_at", defaultSchedule);
      setSelectedDate(
        DateTime.fromISO(defaultSchedule).toFormat("yyyy-MM-dd'T'HH:mm")
      );
    }
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
      description,
      category,
      platform_id,
    } = articleData;

    if (
      !title ||
      !content ||
      !image ||
      !slug ||
      !meta_title ||
      !tags ||
      !description ||
      !category?.length ||
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
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      const userRole = storedUser?.role?.toLowerCase() || "contributor"; // lowercase untuk konsistensi

      await submitArticle(); // ⬅️ fungsi submit akan set status sesuai role

      localStorage.removeItem("autosave-article");

      // ✅ Popup hanya satu kali & sesuai role
      const isPublished = userRole === "editor" || userRole === "master";

      Swal.fire({
        icon: "success",
        title: isPublished
          ? "✅ Artikel Dipublikasikan!"
          : "🕓 Artikel Dikirim!",
        text: isPublished
          ? "Artikel berhasil dipublikasikan dan sudah tayang."
          : "Artikel Anda telah dikirim dan menunggu review.",
      }).then(() => {
        window.location.reload(); // 🔁 ini akan refresh halaman setelah user klik "OK"
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal Submit",
        text: err.message || "Terjadi kesalahan saat mengirim artikel.",
      });
    }
  };

  useEffect(() => {
    const lastSaved = localStorage.getItem("autosave-article");
    const current = JSON.stringify(articleData);

    if (!lastSaved || JSON.stringify(JSON.parse(lastSaved)?.data) !== current) {
      const timeout = setTimeout(() => {
        localStorage.setItem(
          "autosave-article",
          JSON.stringify({ data: articleData, savedAt: Date.now() })
        );
        console.log("💾 Autosaved (only if changed)");
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [articleData]);

  useEffect(() => {
    const saved = localStorage.getItem("autosave-article");
    if (saved) {
      const parsed = JSON.parse(saved);
      const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 hari

      if (Date.now() - parsed.savedAt <= maxAge) {
        const { data } = parsed;
        Object.entries(data).forEach(([key, value]) => {
          updateArticleData(key, value);
        });
        console.log("♻️ Draft restored from localStorage");
      } else {
        // 🔥 Terlalu lama, hapus
        localStorage.removeItem("autosave-article");
        console.log("🗑️ Draft expired and removed");
      }
    }
  }, []);

  const handleClosePopup = () => {
    setSuccessPopupOpen(false);
    window.location.reload(); // 🔥 Force reload halaman setelah klik "OK"
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1  gap-6 items-start">
        <div className=" space-y-4">
          <div>
            <label className="block mb-2 font-bold text-lg">
              Judul Artikel:
            </label>
            <input
              type="text"
              value={articleData.title}
              onChange={handleTitleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Masukkan Judul Artikel"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">📝 Isi Artikel</h2>
            <ArticleEditor />
          </div>
        </div>
      </div>
      {/* ✅ FORM GAMBAR */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border max-w-1/2 border-gray-300 rounded-md p-4">
          <h2 className="text-xl font-semibold mb-4">🖼️ Gambar Thumbnail</h2>
          <div
            className="h-72 border-dashed border-2 border-gray-400 rounded-md flex justify-center items-center mb-4 relative"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) handleImageUpload({ target: { files: [file] } });
            }}
          >
            {articleData.image ? (
              <img
                src={
                  typeof articleData.image === "string"
                    ? articleData.image
                    : URL.createObjectURL(articleData.image)
                }
                alt="Preview"
                className="h-full w-full object-contain rounded-md"
              />
            ) : (
              <label className="cursor-pointer absolute inset-0 flex justify-center items-center">
                <span className="text-white rounded-lg hover:bg-pink-700 bg-pink-500 p-4 text-md">
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
            <p className="text-sm text-gray-600">📂 {articleData.image.name}</p>
          )}

          {/* ✅ Metadata Gambar */}
          <div className="space-y-2">
            <div>
              <label className="block font-medium">Alt Text:</label>
              <input
                type="text"
                value={articleData.image_alt || ""}
                onChange={(e) => updateArticleData("image_alt", e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Masukkan Alt Text gambar"
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
                placeholder="Masukkan Judul Gambar"
              />
            </div>
            <div>
              <label className="block font-medium">Caption:</label>
              <input
                type="text"
                value={articleData.caption || ""}
                onChange={(e) => updateArticleData("caption", e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Masukkan Caption (eg: source gambar atau deskripsi lain)"
              />
            </div>
          </div>
        </div>

        <div className="border max-w-1/2 border-gray-300 rounded-md p-4">
          <h3 className="text-lg font-medium mb-2">Kategori:</h3>
          <div className="flex flex-col gap-4">
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
      </div>

      <div className=" grid grid-cols-1 gap-6 items-startspace-y-6">
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
          <label className="block mb-2 font-medium">Meta Title (SEO):</label>
          <input
            type="text"
            value={articleData.meta_title}
            onChange={(e) => updateArticleData("meta_title", e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Masukkan Meta Judul SEO"
          />
          <div className="h-4 mt-2 w-full bg-gray-200 rounded">
            <div
              className={`h-full rounded transition-all duration-300 ${
                articleData.meta_title.length >= 60 &&
                articleData.meta_title.length <= 65
                  ? "bg-green-500"
                  : articleData.meta_title.length > 65 ||
                    articleData.meta_title.length < 40
                  ? "bg-red-500"
                  : "bg-yellow-400"
              }`}
              style={{
                width: `${Math.min(
                  (articleData.meta_title.length / 65) * 100,
                  100
                )}%`,
              }}
            ></div>
          </div>
          <p
            className={`text-sm mt-1 ${
              articleData.meta_title.length >= 60 &&
              articleData.meta_title.length <= 65
                ? "text-green-600"
                : articleData.meta_title.length > 65 ||
                  articleData.meta_title.length < 40
                ? "text-red-500"
                : "text-yellow-600"
            }`}
          >
            {articleData.meta_title.length} / 65 karakter
          </p>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Deskripsi (SEO Description):
          </label>
          <textarea
            rows={4}
            value={articleData.description || ""}
            onChange={(e) => {
              setIsDescriptionEdited(true);
              updateArticleData("description", e.target.value);
            }}
            className="w-full p-2 border rounded-md"
            placeholder="Masukkan deskripsi singkat untuk meta SEO dan preview..."
          ></textarea>

          <div className="h-4 mt-2 w-full bg-gray-200 rounded">
            <div
              className={`h-full rounded transition-all duration-300 ${
                articleData.description?.length >= 120 &&
                articleData.description?.length <= 160
                  ? "bg-green-500"
                  : articleData.description?.length >= 80
                  ? "bg-yellow-400"
                  : "bg-red-500"
              }`}
              style={{
                width: `${Math.min(
                  (articleData.description?.length / 160) * 100,
                  100
                )}%`,
              }}
            ></div>
          </div>

          <p
            className={`text-sm mt-1 ${
              articleData.description?.length >= 120 &&
              articleData.description?.length <= 160
                ? "text-green-600"
                : articleData.description?.length >= 80
                ? "text-yellow-600"
                : "text-red-500"
            }`}
          >
            {articleData.description?.length || 0} / 160 karakter
          </p>
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-2 mt-4 font-medium">Tags:</label>
          <input
            type="text"
            value={articleData.tags}
            onChange={(e) => updateArticleData("tags", e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="gunakan (koma) dan (spasi) dibelakang tag untuk menambah tag (eg: prabowo, gibran)"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            🗓️ Tanggal Publikasi:
          </label>
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
