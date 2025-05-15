"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useBackend } from "@/context/BackContext"; // ✅ Import BackContext

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  }
);

const ArticleEditor = () => {
  const {
    articleData,
    updateArticleData,
    uploadArticleImage,
    getArticlesLink,
  } = useBackend();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const apiKey =
    process.env.NEXT_PUBLIC_TINYMCE_API_KEY ||
    // "7jfd9zlib72t0hy2djlaju8pshs56n96a658r65fa6ji795c";
    // "srha4vit683zf5eg0vnzbepkglfxs11f72kt4ccye3bxw5j0";
    "8ey29h76atxu6uce69zo6782ylewrsbnu8xo3iie94b6x6tm";

  return (
    <div className="p-4 border rounded-md bg-white shadow-md">
      {!editorLoaded && (
        <button
          onClick={() => setEditorLoaded(true)}
          className="p-3 mb-2 border rounded-lg bg-pink-500 text-white"
        >
          Click to Write/edit
        </button>
      )}

      {editorLoaded && (
        <Editor
          apiKey={apiKey}
          value={articleData.content} // ✅ Gunakan state dari BackContext
          onEditorChange={(newContent) =>
            updateArticleData("content", newContent)
          } // Update langsung
          init={{
            height: 600,
            menubar: true,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "media",
              "table",
              "help",
              "wordcount",
              
            ],
            toolbar:
              "undo redo |  blocks | alignleft " +
              "| bold italic underline blockquote  |  " +
              "bullist numlist outdent indent | link image media",

            block_formats:
              "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4",
            fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",

            link_list: async function (success) {
              try {
                const articles = await getArticlesLink(1, "ALL"); // 🔥 misal ambil artikel halaman 1 semua kategori

                const links =
                  articles?.data?.map((article) => ({
                    title: article.title,
                    value: `https://yourdomain.com/article/${article.slug}`, // 🔥 ganti ke domain kamu
                  })) || [];

                success(links);
              } catch (error) {
                console.error("Gagal mengambil artikel:", error);
                success([]); // tetap panggil success biar TinyMCE gak error
              }
            },

            

            

            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            paste_data_images: true, // ✅ Izinkan paste & drag and drop gambar

            // ✅ Tambahkan ini agar elemen `script` dan `blockquote` tidak dihapus!
            extended_valid_elements:
              "script[src|async|charset],blockquote[class|dir|lang|data-*],iframe[src|frameborder|allowfullscreen],a[href|target],img[src|alt|title|width|height]",
            valid_children: "+body[script],+blockquote[a|script]",
            entity_encoding: "raw", // ✅ Jangan escape elemen HTML
            verify_html: false, // ✅ Jangan verifikasi elemen HTML

            // ✅ Tambahkan ini agar TinyMCE tidak membersihkan tag embed
            valid_elements: "*[*]",
            cleanup: false,

            protect: [/\<\/?script\>/g, /\<\/?blockquote\>/g],

            

            file_picker_callback: function (callback, value, meta) {
              if (meta.filetype === "image") {
                const input = document.createElement("input");
                input.setAttribute("type", "file");
                input.setAttribute("accept", "image/*");

                input.onchange = async function () {
                  const file = this.files[0];
                  if (!file) return;

                  try {
                    const url = await uploadArticleImage(file);
                    console.log("📦 URL hasil upload:", url);

                    if (
                      url &&
                      typeof url === "string" &&
                      url.startsWith("http")
                    ) {
                      callback(url, { alt: file.name }); // ✅ hanya panggil kalau URL valid
                    } else {
                      alert("❌ Upload gagal: URL tidak valid atau kosong.");
                    }
                  } catch (err) {
                    console.error("❌ Upload gagal:", err);
                    alert("❌ Upload gagal: " + err.message);
                  }
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
