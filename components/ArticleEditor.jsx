"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), {
  ssr: false,
});

const ArticleEditor = () => {
  const [content, setContent] = useState("");

  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  return (
    <div className="p-4 border rounded-md bg-white shadow-md">
      
      <Editor
        apiKey="7jfd9zlib72t0hy2djlaju8pshs56n96a658r65fa6ji795c"
        value={content}
        onEditorChange={handleEditorChange}
        init={{
          height: 400,
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
          ],
          toolbar:
            "undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
      
    </div>
  );
};

export default ArticleEditor;
