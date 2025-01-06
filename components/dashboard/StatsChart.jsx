"use client";
import React, { useState, useEffect } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Data Statistik
import { userStats } from "@/data/dashboardData";

const StatsChart = ({ userId }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTimeframe, setSelectedTimeframe] = useState("monthly"); // daily, weekly, monthly
  const [filteredBarData, setFilteredBarData] = useState({ labels: [], datasets: [] });
  const [filteredDoughnutData, setFilteredDoughnutData] = useState({ labels: [], datasets: [] });
  const [filteredTotalViews, setFilteredTotalViews] = useState(0);

  useEffect(() => {
    const userStat = userStats[userId]?.stats;

    if (!userStat) return;

    const timeframeKey = `${selectedTimeframe}Data`;

    let updatedTotalArticles = 0;
    let updatedTotalViews = 0; // ✅ Definisikan di sini

    // Hitung total artikel berdasarkan kategori
    if (selectedCategory === "All") {
      updatedTotalArticles = userStat.barData.datasets.reduce(
        (acc, dataset) => acc + dataset.total,
        0
      );
      updatedTotalViews = userStat.doughnutData.datasets[0][timeframeKey]?.reduce(
        (acc, value) => acc + value,
        0
      ) || 0;
    } else {
      const selectedDataset = userStat.barData.datasets.find(
        (dataset) => dataset.label === selectedCategory
      );
      updatedTotalArticles = selectedDataset?.total || 0;

      const categoryIndex = userStat.doughnutData.labels.indexOf(selectedCategory);
      if (categoryIndex !== -1) {
        updatedTotalViews =
          userStat.doughnutData.datasets[0][timeframeKey]?.[categoryIndex] || 0;
      }
    }

    // Update Data untuk Grafik Bar
    const updatedBarData = {
      labels: userStat.barData[`${selectedTimeframe}Labels`] || [],
      datasets: userStat.barData.datasets
        .filter((dataset) => selectedCategory === "All" || dataset.label === selectedCategory)
        .map((dataset) => ({
          ...dataset,
          data: dataset[timeframeKey] || [],
        })),
    };

    // Update Data untuk Grafik Doughnut
    let updatedDoughnutData = {};
    if (selectedCategory === "All") {
      updatedDoughnutData = {
        labels: userStat.doughnutData.labels,
        datasets: [
          {
            ...userStat.doughnutData.datasets[0],
            data: userStat.doughnutData.datasets[0][timeframeKey] || [],
          },
        ],
      };
    } else {
      const categoryIndex = userStat.doughnutData.labels.indexOf(selectedCategory);
      if (categoryIndex !== -1) {
        updatedDoughnutData = {
          labels: [selectedCategory],
          datasets: [
            {
              ...userStat.doughnutData.datasets[0],
              data: [userStat.doughnutData.datasets[0][timeframeKey][categoryIndex]],
              backgroundColor: [
                userStat.doughnutData.datasets[0].backgroundColor[categoryIndex],
              ],
              borderColor: [
                userStat.doughnutData.datasets[0].borderColor[categoryIndex],
              ],
            },
          ],
        };
      }
    }

    setFilteredBarData(updatedBarData);
    setFilteredDoughnutData(updatedDoughnutData);
    setFilteredTotalViews(updatedTotalViews); // ✅ Update di sini
  }, [selectedTimeframe, selectedCategory, userId]);

  return (
    <div>
      {/* Dropdown Filter */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filter Timeframe */}
        <div>
          <label className="block mb-2 text-sm font-medium">Filter by Timeframe:</label>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* Filter Category */}
        <div>
          <label className="block mb-2 text-sm font-medium">Filter by Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="All">All</option>
            {userStats[userId]?.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Bar Chart */}
        <div className="p-4 bg-white shadow-sm rounded-md">
          <h2>Overview ({selectedTimeframe})</h2>
          <Bar data={filteredBarData} className="mt-10" />
        </div>

        {/* Doughnut Chart */}
        <div className="p-4 bg-white shadow-sm rounded-md">
          <h2>Total Views by Category ({selectedTimeframe})</h2>
          <Doughnut data={filteredDoughnutData} className="p-10" />
        </div>

        {/* Line Chart */}
        <div className="p-4 bg-white shadow-sm rounded-md">
          <h2>Earnings Trend</h2>
          <Line data={userStats[userId]?.stats.lineData} />
        </div>
      </div>
    </div>
  );
};

export default StatsChart;
