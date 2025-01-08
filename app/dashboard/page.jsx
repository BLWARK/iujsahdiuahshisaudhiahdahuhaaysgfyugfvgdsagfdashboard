"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatsChart from "@/components/dashboard/StatsChart";
import { userStats } from "@/data/dashboardData";

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalViews: 0,
    totalEarnings: 0,
  });

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTimeframe, setSelectedTimeframe] = useState("monthly");
  const [totalArticles, setTotalArticles] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        const userStat = userStats[parsedUser.id]?.stats;
        if (userStat) {
          setStats({
            totalArticles: userStat.totalArticles,
            totalViews: userStat.totalViews,
            totalEarnings: userStat.totalEarnings,
          });
        }
      } catch (error) {
        localStorage.removeItem("user");
        router.push("/login");
      }
    } else {
      router.push("/login");
    }

    setIsLoading(false);
  }, [router]);

  // ✅ Perhitungan Total Articles berdasarkan kategori dan timeframe
  useEffect(() => {
    if (!user) return;

    const userStat = userStats[user.id]?.stats;

    let total = 0;
    if (selectedCategory === "All") {
      total = userStat.barData.datasets.reduce(
        (acc, dataset) =>
          acc + dataset[`${selectedTimeframe}Data`]?.reduce((sum, val) => sum + val, 0) || 0,
        0
      );
    } else {
      const selectedDataset = userStat.barData.datasets.find(
        (dataset) => dataset.label === selectedCategory
      );
      total = selectedDataset?.[`${selectedTimeframe}Data`]?.reduce((sum, val) => sum + val, 0) || 0;
    }

    setTotalArticles(total);
  }, [selectedCategory, selectedTimeframe, user]);

  if (isLoading) return <p>Loading...</p>;

  if (!user) {
    return <p className="text-center mt-10">Redirecting to login...</p>;
  }

  return (
    <div className="p-6">
      {/* Header Dashboard */}
      {/* <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}! 👋</h1>
      <p className="text-gray-600 mb-6">Role: {user.role}</p> */}

      {/* Statistik Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white shadow-sm rounded-md text-left">
          <h2 className=" font-semibold mb-2">Total Articles</h2>
          <p className="text-lg font-bold">{totalArticles}</p>
          
        </div>

        <div className="p-4 border rounded-md bg-white shadow-sm">
          <h3 className=" font-semibold mb-2">Total Views</h3>
          <p className="font-bold text-lg">{stats.totalViews}</p>
        </div>
        <div className="p-4 border rounded-md bg-white shadow-sm">
          <h3 className=" font-semibold mb-2">Total Earnings</h3>
          <p className="font-bold text-lg">IDR {stats.totalEarnings}</p>
        </div>
      </div>

      {/* Komponen Statistik */}
      <StatsChart
        userId={user.id}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedTimeframe={selectedTimeframe}
        setSelectedTimeframe={setSelectedTimeframe}
      />

      {/* Aktivitas Terbaru */}
      <div className="bg-white p-6 rounded-md shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <ul className="list-disc list-inside text-gray-600">
          <li>User John added a new project.</li>
          <li>Server backup completed successfully.</li>
          <li>New member joined: Alice.</li>
          <li>System update installed successfully.</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
