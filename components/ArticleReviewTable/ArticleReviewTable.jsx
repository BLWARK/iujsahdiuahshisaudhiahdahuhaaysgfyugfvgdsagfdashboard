import React, { useState } from "react";
import ArticlePublishTable from "./ArticlePublishTable";
import ArticlePendingTable from "./ArticlePendingTable";
import ArticleRejectTable from "./ArticleRejectTable";

const ArticleReview = () => {
  const [activeTab, setActiveTab] = useState("publish");

  return (
    <div>
      {/* ✅ Navigasi Tab */}
      <div className="flex gap-4 mb-4 border-b border-b-gray-300 pb-6 w-[380px]">
        <button
          onClick={() => setActiveTab("publish")}
          className={activeTab === "publish" ? "font-bold p-4 bg-pink-500 text-white rounded-lg" : "border border-gray-400 p-4 rounded-lg text-gray-800"}
        >
          Published
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={activeTab === "pending" ? "font-bold p-4 bg-pink-500 text-white rounded-lg" : "border border-gray-400 p-4 rounded-lg text-gray-800"}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveTab("reject")}
          className={activeTab === "reject" ? "font-bold p-4 bg-pink-500 text-white rounded-lg" : "border border-gray-400 p-4 rounded-lg text-gray-800"}
        >
          Rejected
        </button>
      </div>

      {activeTab === "publish" && <ArticlePublishTable />}
      {activeTab === "pending" && <ArticlePendingTable />}
      {activeTab === "reject" && <ArticleRejectTable />}
    </div>
  );
};

export default ArticleReview;
