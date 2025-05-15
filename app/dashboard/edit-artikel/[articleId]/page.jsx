"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AiOutlineSave, AiOutlineSend } from "react-icons/ai";
import { useBackend } from "@/context/BackContext";
import ArticleEditor from "@/components/ArticleEditor";
import SuccessPopup from "@/components/SuccessPopup";
import Swal from "sweetalert2";
import { DateTime } from "luxon";

const EditArtikelPage = () => {
  const {
    articleData,
    updateArticleData,
    saveDraft,
    submitArticle,
    getArticleById,
    getCategoriesByPlatformId,
    selectedPortal,
    submitEditedArticle,
    saveEditedDraft,
  } = useBackend();

  const [categories, setCategories] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [isSuccessPopupOpen, setSuccessPopupOpen] = useState(false);
  const [isDescriptionEdited, setIsDescriptionEdited] = useState(false);

  const { articleId } = useParams();
  const isEditMode = Boolean(articleId);

  console.log("🧪 articleId dari useParams:", articleId); // 🔥 CEK DI SINI

  useEffect(() => {
    const fetch = async () => {
      if (!articleId) return;
      const res = await getArticleById(articleId);
      console.log("🎯 Hasil getArticleById:", res); // <== ini juga harus muncul
      if (res) {
        Object.entries(res).forEach(([key, value]) => {
          updateArticleData(key, value);
        });
      }
    };
    fetch();
  }, [articleId]);

  console.log("🧠 articleData:", articleData); // Cek apakah data ada

  useEffect(() => {
    const fetchCategories = async () => {
      if (!selectedPortal?.platform_id) return;
      const result = await getCategoriesByPlatformId(
        selectedPortal.platform_id
      );
      setCategories(result);
    };
    fetchCategories();
  }, [selectedPortal]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z\s-]/g, "") // ⛔ Hapus semua angka & karakter aneh
      .replace(/\s+/g, "-") // Ganti spasi dengan tanda hubung
      .replace(/-+/g, "-") // Gabungkan tanda minus berturut-turut
      .replace(/^-+|-+$/g, ""); // Hapus tanda minus di awal dan akhir
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateArticleData("imageFile", file);
      const reader = new FileReader();
      reader.onloadend = () => updateArticleData("image", reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    updateArticleData("image", "");
    updateArticleData("imageFile", null);
  };

 const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    updateArticleData("title", newTitle);
    updateArticleData("slug", generateSlug(newTitle));
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

  const formatDateForInput = (isoString) =>
    isoString ? DateTime.fromISO(isoString).toFormat("yyyy-MM-dd'T'HH:mm") : "";

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

  const handleSubmitArticle = async () => {
    if (!articleData.platform_id) {
      alert("❗ Pilih portal terlebih dahulu sebelum mengirim artikel.");
      return;
    }

    try {
      if (isEditMode) {
        await submitEditedArticle(articleId, articleData);
      } else {
        await submitArticle();
      }
      setSuccessPopupOpen(true);
    } catch (err) {
      console.error("❌ Gagal submit artikel:", err);
      alert("Terjadi kesalahan saat menyimpan artikel.");
    }
  };

  const handleSaveDraft = async () => {
    try {
      if (isEditMode) {
        await saveEditedDraft(articleId, articleData);

        Swal.fire({
          icon: "success",
          title: "Draft Disimpan!",
          text: "Artikel berhasil disimpan sebagai draft.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        }).then(() => {
          // Optional: refresh halaman atau redirect
          window.location.reload();
        });
      }
    } catch (err) {
      console.error("❌ Gagal menyimpan draft:", err);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat menyimpan draft.",
      });
    }
  };

  const handleClosePopup = () => {
    setSuccessPopupOpen(false);
    window.location.reload();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">✏️ Edit Artikel</h1>

      <div className="grid grid-cols-1  gap-6">
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Judul Artikel</label>
            <input
              type="text"
              value={articleData.title || ""}
              onChange={handleTitleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Konten</label>
            <ArticleEditor />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-10">
        <div>
          <label className="block mb-2 font-semibold">
            🖼️ Gambar Thumbnail
          </label>
          <div className="border p-4 rounded-md">
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
                <label className="block font-medium">
                  Caption (tulisan dibawah gambar utama):
                </label>
                <input
                  type="text"
                  value={articleData.caption || ""}
                  onChange={(e) => updateArticleData("caption", e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
            <button
              onClick={handleRemoveImage}
              className="bg-red-500 text-white w-full p-2 rounded-md mt-4"
            >
              Hapus Gambar
            </button>
          </div>
        </div>
        <div className="flex flex-col border  p-10">
          <h3 className="font-semibold mb-2">Kategori</h3>
          <div className="grid grid-cols-1 gap-4">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={articleData.category?.includes(cat.category_name)}
                  onChange={() => {
                    const updated = articleData.category?.includes(
                      cat.category_name
                    )
                      ? articleData.category.filter(
                          (c) => c !== cat.category_name
                        )
                      : [...(articleData.category || []), cat.category_name];
                    updateArticleData("category", updated);
                  }}
                />
                {cat.category_name}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6 mt-4">
        <div className="mt-4">
          <label className="block mb-2 font-medium">Slug SEO:</label>
          <input
            type="text"
            value={articleData.slug || ""}
            onChange={(e) => updateArticleData("slug", e.target.value)}
            placeholder="Slug SEO"
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

        <div className="">
          <label className="block mb-2 font-medium">Tags:</label>
          <input
            type="text"
            value={articleData.tags || ""}
            onChange={(e) => updateArticleData("tags", e.target.value)}
            placeholder="Tags"
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="">
          <label className="block mb-2 font-medium">Date:</label>
          <input
            type="datetime-local"
            value={selectedDate || formatDateForInput(articleData.date)}
            onChange={handleScheduledChange}
            min={now}
            className="p-2 border rounded-md"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSaveDraft}
          className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          <AiOutlineSave size={18} /> Simpan Draft
        </button>
        <button
          onClick={handleSubmitArticle}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md"
        >
          <AiOutlineSend size={18} /> Submit Artikel
        </button>
      </div>

      <SuccessPopup isOpen={isSuccessPopupOpen} onClose={handleClosePopup} />
    </div>
  );
};

export default EditArtikelPage;
