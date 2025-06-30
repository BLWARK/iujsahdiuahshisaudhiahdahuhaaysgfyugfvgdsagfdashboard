"use client";
import React from "react";
import dayjs from "dayjs";

const FilterButtons = ({
  activeFilter,
  setActiveFilter,
  showMore,
  setShowMore,
  getDailyChart,
  getDailyChartByDateRange,
  selectedPortal,
  setIsCustomFilterActive,
  setCompareChartData,
  isCustomFilterActive,
  isCompareMode, // ✅ tambahkan ini
}) => {
  const handleClick = async (label) => {
    if (!selectedPortal?.platform_id) return;

   const today = dayjs().format("YYYY-MM-DD");
const start =
  label === "7d"
    ? dayjs().subtract(6, "day").format("YYYY-MM-DD")
    : dayjs().subtract(27, "day").format("YYYY-MM-DD");

if (label === "24h") {
  await getDailyChart(selectedPortal.platform_id);
} else {
  await getDailyChartByDateRange(start, today);
}

setIsCustomFilterActive(false); // ← pindah ke luar, agar selalu di-reset


    setCompareChartData([]);
    setActiveFilter(label);
  };

  return (
    <div className="my-5 flex items-center gap-4">
      <div className="flex gap-3">
       {["24h", "7d", "28d"].map((label) => (
  <button
    key={label}
    onClick={() => handleClick(label)}
    disabled={showMore}
    className={`px-3 py-1 text-sm rounded border ${
      !isCustomFilterActive && !isCompareMode && activeFilter === label
        ? "bg-blue-600 text-white"
        : "bg-white text-gray-600 border-gray-300"
    } ${showMore ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    {label === "24h"
      ? "Last 24 hours"
      : label === "7d"
      ? "Last 7 days"
      : "Last 28 days"}
  </button>
))}

      </div>
    <button
  onClick={() => setShowMore(true)} // ← langsung pakai prop
  className="text-sm text-blue-600 hover:underline"
>
  More ▾
</button>

    </div>
  );
};

export default FilterButtons;
