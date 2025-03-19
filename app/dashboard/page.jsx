"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatsChart from "@/components/dashboard/StatsChart";
import { userStats } from "@/data/dashboardData"; // ✅ Gunakan data dummy langsung

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null); // Data statistik bisa null awalnya
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      console.warn("🚨 User tidak ditemukan! Redirecting to login...");
      router.push("/login");
      return;
    }

    setUser(storedUser);
    console.log("✅ [Dashboard] User ditemukan:", storedUser);

    // ✅ Gunakan Data Dummy
    useDummyStats(storedUser.user_id);
  }, [router]);

  // ✅ Gunakan Data Dummy untuk Statistik
  const useDummyStats = (userId) => {
    const dummyStats = userStats[userId]?.stats || userStats[1]?.stats; // Default ke user ID 1 jika tidak ada
    setStats(dummyStats);
    console.log("🚀 Menggunakan Data Dummy untuk Statistik!", dummyStats);
    setIsLoading(false);
  };

  if (isLoading) return <p>Loading...</p>;
  if (!user) return <p className="text-center mt-10">Redirecting to login...</p>;

  return (
    <div className="p-6">
      {/* Statistik Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white shadow-sm rounded-md text-left">
          <h2 className="font-semibold mb-2">Total Articles</h2>
          <p className="text-lg font-bold">{stats?.totalArticles || 0}</p>
        </div>

        <div className="p-4 border rounded-md bg-white shadow-sm">
          <h3 className="font-semibold mb-2">Total Views</h3>
          <p className="font-bold text-lg">{stats?.totalViews || 0}</p>
        </div>

        <div className="p-4 border rounded-md bg-white shadow-sm">
          <h3 className="font-semibold mb-2">Total Earnings</h3>
          <p className="font-bold text-lg">IDR {stats?.totalEarnings || 0}</p>
        </div>
      </div>

      {/* 📊 Komponen Statistik */}
      {/* <StatsChart stats={stats} /> */}
    </div>
  );
};

export default DashboardPage;
