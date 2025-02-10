"use client";

import React, { useState, useEffect } from "react";
import SummaryCard from "@/components/SummaryCard";
import ArticleTable from "@/components/userArticleTable/userArticletable";
import { AiOutlineFileDone, AiOutlineCloseCircle, AiOutlineFileSearch } from "react-icons/ai";
import users from "@/data/users";
import { loadArticlesByPortal } from "@/utils/loadPortalData";
import portals from "@/data/portals"; // ✅ Import data portal

const AnalyticPage = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedPortal, setSelectedPortal] = useState("all"); // ✅ Tambahkan filter portal
  const [filteredArticles, setFilteredArticles] = useState([]);

  // 🔄 Update artikel berdasarkan user dan portal yang dipilih
  useEffect(() => {
    let articles = [];

    if (selectedPortal === "all") {
      // Ambil semua artikel dari semua portal
      portals.forEach((portal) => {
        articles = articles.concat(loadArticlesByPortal(portal.id));
      });
    } else {
      // Ambil artikel dari portal tertentu
      articles = loadArticlesByPortal(selectedPortal);
    }

    // Filter berdasarkan user yang dipilih
    if (selectedUser) {
      articles = articles.filter((article) => article.author === selectedUser);
    }

    setFilteredArticles(articles);
  }, [selectedUser, selectedPortal]);

  // 📊 Hitung jumlah artikel berdasarkan status
  const totalPublished = filteredArticles.filter((a) => a.status === "Published").length;
  const totalRejected = filteredArticles.filter((a) => a.status === "Rejected").length;
  const totalPending = filteredArticles.filter((a) => a.status === "Pending").length;
  const totalArticles = filteredArticles.length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Article Analytics</h1>

      {/* Filter Portal dan User */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Filter Portal */}
        <select
          onChange={(e) => setSelectedPortal(e.target.value)}
          value={selectedPortal}
          className="p-2 border rounded-md w-full md:w-1/3"
        >
          <option value="all">Semua Portal</option>
          {portals.map((portal) => (
            <option key={portal.id} value={portal.id}>
              {portal.name}
            </option>
          ))}
        </select>

        {/* Filter User */}
        <select
          onChange={(e) => setSelectedUser(e.target.value)}
          value={selectedUser}
          className="p-2 border rounded-md w-full md:w-1/3"
        >
          <option value="">Semua User</option>
          {users.map((user) => (
            <option key={user.id} value={user.name}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          title="Published Articles"
          count={totalPublished}
          icon={<AiOutlineFileDone size={30} />}
          color="bg-green-500"
        />
        <SummaryCard
          title="Rejected Articles"
          count={totalRejected}
          icon={<AiOutlineCloseCircle size={30} />}
          color="bg-red-500"
        />
        <SummaryCard
          title="Pending Articles"
          count={totalPending}
          icon={<AiOutlineFileSearch size={30} />}
          color="bg-yellow-500"
        />
        <SummaryCard
          title="Total Articles"
          count={totalArticles}
          icon={<AiOutlineFileDone size={30} />}
          color="bg-blue-500"
        />
      </div>

      {/* Tabel Artikel */}
      <ArticleTable articles={filteredArticles} />
    </div>
  );
};

export default AnalyticPage;
