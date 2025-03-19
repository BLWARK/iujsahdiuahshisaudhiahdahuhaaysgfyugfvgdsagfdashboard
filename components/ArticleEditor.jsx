"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useBackend } from "@/context/BackContext"; // ✅ Import BackContext

const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

const ArticleEditor = () => {
  const { articleData, updateArticleData } = useBackend();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY || "7jfd9zlib72t0hy2djlaju8pshs56n96a658r65fa6ji795c";

  return (
    <div className="p-4 border rounded-md bg-white shadow-md">
      {!editorLoaded && (
        <button onClick={() => setEditorLoaded(true)} className="p-3 mb-2 border rounded-lg bg-blue-500 text-white">
          Click to Write
        </button>
      )}
      
      {editorLoaded && (
        <Editor
          apiKey={apiKey}
          value={articleData.content} // ✅ Gunakan state dari BackContext
          onEditorChange={(newContent) => updateArticleData("content", newContent)} // Update langsung
          init={{
            height: 600,
            menubar: true,
            plugins: [
              "advlist", "autolink", "lists", "link", "image",
              "charmap", "preview", "anchor", "searchreplace",
              "visualblocks", "code", "fullscreen", "media",
              "table", "help",
            ],
            toolbar:
              "undo redo | formatselect | bold italic backcolor | " +
              "alignleft aligncenter alignright alignjustify | " +
              "bullist numlist outdent indent | removeformat | help | image",
            content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            paste_data_images: true, // ✅ Izinkan paste & drag and drop gambar

            // ✅ Custom Upload Handler untuk Mengunggah Gambar ke Backend
            images_upload_handler: async (blobInfo, success, failure) => {
              try {
                const formData = new FormData();
                formData.append("file", blobInfo.blob(), blobInfo.filename());

                // Kirim gambar ke backend
                const response = await fetch("https://your-backend.com/upload", {
                  method: "POST",
                  body: formData,
                });

                const data = await response.json();
                if (data.url) {
                  success(data.url); // ✅ Gunakan URL gambar dari server
                } else {
                  failure && failure("Upload gagal");
                }
              } catch (error) {
                failure && failure("Gagal mengunggah gambar");
              }
            },

            // ✅ File Picker Callback untuk memilih gambar dari komputer
            file_picker_callback: function (callback, value, meta) {
              if (meta.filetype === "image") {
                const input = document.createElement("input");
                input.setAttribute("type", "file");
                input.setAttribute("accept", "image/*");
                input.onchange = function () {
                  const file = this.files[0];
                  const reader = new FileReader();
                  reader.onload = function () {
                    callback(reader.result, { alt: file.name });
                  };
                  reader.readAsDataURL(file);
                };
                input.click();
              }
            },
          }}
        />
      )}
    </div>
  );
};

export default ArticleEditor;
