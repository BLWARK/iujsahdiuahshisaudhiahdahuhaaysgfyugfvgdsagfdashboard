"use client";
import React, { useState } from "react";
import { AiOutlineSave, AiOutlineSend } from "react-icons/ai";
import ArticleEditor from "@/components/ArticleEditor";

const TambahArtikel = () => {
  const [title, setTitle] = useState("");
  const [meta, setMeta] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [altText, setAltText] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [imageDescription, setImageDescription] = useState("");

  const categories = ["Crypto News", "Business", "Technology", "NFT"];

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Grid untuk Judul, Markdown Editor, dan Thumbnail */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Kolom Kiri: Judul Artikel & Markdown Editor */}
        <div className="md:col-span-2 space-y-4">
          {/* Judul Artikel */}
          <div>
            <label className="block mb-2 font-bold text-lg">
              Judul Artikel:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Isi Artikel (Markdown Editor) */}
          <div>
            <h2 className="text-xl font-semibold mb-2">📝 Isi Artikel</h2>
            <ArticleEditor />
          </div>
        </div>

        {/* Kolom Kanan: Thumbnail Gambar */}
        <div>
          <h2 className="text-xl font-semibold mb-4">🖼️ Gambar Thumbnail</h2>
          <div className="border border-gray-300 rounded-md p-4">
            {/* Area Upload Gambar */}
            <div className="h-48 border-dashed border-2 border-gray-400 rounded-md flex justify-center items-center mb-4">
              {image ? (
                <img
                  src={image}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-md"
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

            {/* Informasi Gambar */}
            <div className="space-y-2">
              <div>
                <label className="block font-medium">Alt Text:</label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Enter alt text"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium">Title:</label>
                <input
                  type="text"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  placeholder="Enter title"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium">Caption:</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Enter caption"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium">Description:</label>
                <textarea
                  value={imageDescription}
                  onChange={(e) => setImageDescription(e.target.value)}
                  placeholder="Enter description"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Slug SEO */}
      <div>
        {/* Pilih Kategori */}
        <div className="py-6">
          <h3 className="text-lg font-medium mb-2">Kategori:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <label key={category} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="w-4 h-4"
                />
                {category}
              </label>
            ))}
          </div>
        </div>
        <label className="block mb-2 font-medium">Slug SEO:</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="e.g., judul-artikel-seo"
          className="w-full p-2 border rounded-md"
        />
      </div>
      {/* Meta Data */}
      <div>
        <label className="block mb-2 font-medium">
          Meta Data ({meta.length}/85 characters):
        </label>
        <input
          type="text"
          value={meta}
          onChange={(e) => setMeta(e.target.value)}
          maxLength={85}
          className={`w-full p-2 border rounded-md ${
            meta.length > 85 ? "border-red-500" : ""
          }`}
        />
      </div>
      {/* Deskripsi */}
      <div>
        <label className="block mb-2 font-medium">
          Description ({description.length}/150 characters):
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={150}
          className={`w-full p-2 border rounded-md ${
            description.length > 150 ? "border-red-500" : ""
          }`}
        />
      </div>
      {/* Tag */}
      <div>
        <label className="block mb-2 mt-4 font-medium">Tags:</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., Bitcoin, Crypto News, Technology"
          className="w-full p-2 border rounded-md"
        />
      </div>
      
      {/* Tombol Simpan */}
      <div className="flex justify-start items-center gap-4">
        {/* Save to Draft */}
        <button className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 mt-4 rounded-md w-[20%]">
          <AiOutlineSave size={18} />
          Save to Draft
        </button>

        {/* Submit Article */}
        <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 mt-4 rounded-md w-[20%]">
          <AiOutlineSend size={18} />
          Submit Article
        </button>
      </div>
    </div>
  );
};

export default TambahArtikel;
