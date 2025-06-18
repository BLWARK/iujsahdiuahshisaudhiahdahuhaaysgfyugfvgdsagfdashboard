"use client";
import React, { useState, useEffect, useContext, useMemo } from "react";
import TrafficCard from "@/components/analytic-comp/TrafficCard";
import TrafficChart from "@/components/analytic-comp/TrafficChart";
import MoreModal from "@/components/analytic-comp/MoreModal";
import { calculatePercentageChange } from "@/utils/calculatePercentageChange";
import { getValidDates } from "@/utils/generateDateRange";
import { BackContext } from "@/context/BackContext";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(duration);
dayjs.extend(isBetween);

const WebTraffic = () => {
  const {
    setSelectedPortal,
    selectedPortal,
    getDailyChart,
    getWeeklyChart,
    getMonthlyChart,
    getWeeklyProgress,
    dailyChart,
    weeklyChart,
    monthlyChart,
    weeklyProgress,
    isLoadingChart,
    getDailyChartByDateRange,
  } = useContext(BackContext);

  const [activeFilter, setActiveFilter] = useState("24h");
  const [showMore, setShowMore] = useState(false);
  const [moreTab, setMoreTab] = useState("filter");
  const [customOption, setCustomOption] = useState("");
  const [compareOption, setCompareOption] = useState("");
  const [showCount, setShowCount] = useState(true);
  const [showUnique, setShowUnique] = useState(true);
  const [showDuration, setShowDuration] = useState(true);
  const [isCustomFilterActive, setIsCustomFilterActive] = useState(false);

  const [filterDates, setFilterDates] = useState({ start: "", end: "" });
  const [compareDates, setCompareDates] = useState({
    start: "",
    end: "",
    compareStart: "",
    compareEnd: "",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("selectedPortal") || "null");
    if (!selectedPortal && stored?.platform_id) {
      setSelectedPortal(stored);
    }
  }, []);

  useEffect(() => {
    if (selectedPortal?.platform_id) {
      getDailyChart(selectedPortal.platform_id);
    }
  }, [selectedPortal?.platform_id]);

  useEffect(() => {
    if (selectedPortal?.platform_id && !isCustomFilterActive) {
      getDailyChart(selectedPortal.platform_id);
    }
  }, [activeFilter, selectedPortal?.platform_id, isCustomFilterActive]);

  const isFilterValid =
    customOption === "custom"
      ? filterDates.start && filterDates.end
      : customOption !== "";

  const isCompareValid =
    compareOption === "custom"
      ? compareDates.start &&
        compareDates.end &&
        compareDates.compareStart &&
        compareDates.compareEnd
      : compareOption !== "";

  const handleCancel = () => {
    setShowMore(false);
    setCustomOption("");
    setCompareOption("");
    setFilterDates({ start: "", end: "" });
    setCompareDates({ start: "", end: "", compareStart: "", compareEnd: "" });
  };

  const handleApply = () => {
    setShowMore(false);
    if (!selectedPortal?.platform_id) return;

    if (moreTab === "compare") {
      getWeeklyProgress();
    } else {
      if (customOption === "custom") {
        const start = dayjs(filterDates.start);
        const end = dayjs(filterDates.end);
        const rangeLength = end.diff(start, "day") + 1;

        const extendedStart = start
          .subtract(rangeLength, "day")
          .format("YYYY-MM-DD");
        const extendedEnd = end.format("YYYY-MM-DD");

        getDailyChartByDateRange(extendedStart, extendedEnd); // fetch data termasuk prev
        setIsCustomFilterActive(true);
      } else if (["3month", "6month"].includes(customOption)) {
        getMonthlyChart();
        setIsCustomFilterActive(true);
      } else {
        setIsCustomFilterActive(false);
      }
    }
  };

  const chartData = useMemo(() => {
    if (!Array.isArray(dailyChart)) return [];

    // Jika custom filter aktif, ambil berdasarkan rentang tanggal dari filterDates
    if (isCustomFilterActive && filterDates.start && filterDates.end) {
      return dailyChart
        .filter((d) =>
          dayjs(d.date).isBetween(
            filterDates.start,
            filterDates.end,
            null,
            "[]"
          )
        )
        .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
    }

    // Jika pakai preset filter seperti 24h, 7d, 28d
    const range = activeFilter === "24h" ? 6 : activeFilter === "7d" ? 6 : 27;
    const validDates = getValidDates(range);
    return dailyChart
      .filter((d) => validDates.includes(d.date))
      .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
  }, [activeFilter, dailyChart, isCustomFilterActive, filterDates]);

  const totalVisits = useMemo(() => {
    if (!Array.isArray(chartData) || chartData.length === 0) return 0;

    if (isCustomFilterActive) {
      // Jika mode custom (date-range), jumlahkan semua data
      return chartData.reduce((sum, d) => sum + (d.totalVisitors || 0), 0);
    }

    if (activeFilter === "24h") {
      // Ambil hari terakhir saja
      const latest = chartData[chartData.length - 1];
      return latest?.totalVisitors || 0;
    }

    // Untuk 7d atau 28d → jumlahkan seluruh data dalam chartData
    return chartData.reduce((sum, d) => sum + (d.totalVisitors || 0), 0);
  }, [chartData, activeFilter, isCustomFilterActive]);

  const percentageChange = useMemo(
    () =>
      calculatePercentageChange(
        dailyChart,
        activeFilter,
        "totalVisitors",
        isCustomFilterActive ? filterDates : null // ✅ hanya kirim jika memang aktif
      ),
    [dailyChart, activeFilter, filterDates, isCustomFilterActive]
  );

  const uniqueChange = useMemo(
    () =>
      calculatePercentageChange(
        dailyChart,
        activeFilter,
        "uniqueVisitors",
        isCustomFilterActive ? filterDates : null
      ),
    [dailyChart, activeFilter, filterDates, isCustomFilterActive]
  );

  const durationChange = useMemo(
    () =>
      calculatePercentageChange(
        dailyChart,
        activeFilter,
        "duration",
        isCustomFilterActive ? filterDates : null
      ),
    [dailyChart, activeFilter, filterDates, isCustomFilterActive]
  );

  const getFilterLabel = () => {
    if (isCustomFilterActive && filterDates.start && filterDates.end) {
      const start = dayjs(filterDates.start).format("DD MMM");
      const end = dayjs(filterDates.end).format("DD MMM YYYY");
      return `${start} – ${end}`;
    }

    if (activeFilter === "24h") return "Last 24 hours";
    if (activeFilter === "7d") return "Last 7 days";
    if (activeFilter === "28d") return "Last 28 days";

    return "";
  };

  const avgDurationFormatted = useMemo(() => {
    if (!Array.isArray(chartData) || chartData.length === 0) return "00:00:00";

    let durations = chartData;

    if (activeFilter === "24h" && !isCustomFilterActive) {
      const todayStr = dayjs().format("YYYY-MM-DD");
      durations = chartData.filter((d) => d.date === todayStr);
    }

    const valid = durations.filter((d) => d.duration > 0);
    const total = valid.reduce((sum, d) => sum + d.duration, 0);
    const avg = total / (valid.length || 1);

    return dayjs.duration(Math.floor(avg), "seconds").format("HH:mm:ss");
  }, [chartData, activeFilter, isCustomFilterActive]);

  return (
    <div className="pl-6 relative">
      <h2 className="text-2xl font-bold text-gray-800">Traffic & Engagement</h2>
      <div className="my-5 flex items-center gap-4">
        <div className="flex gap-3">
          {["24h", "7d", "28d"].map((label) => (
            <button
              key={label}
              onClick={() => {
                if (isCustomFilterActive) {
                  const today = dayjs().format("YYYY-MM-DD");
                  const start =
                    label === "7d"
                      ? dayjs().subtract(6, "day").format("YYYY-MM-DD")
                      : dayjs().subtract(27, "day").format("YYYY-MM-DD");
                  if (label === "24h")
                    getDailyChart(selectedPortal?.platform_id);
                  else getDailyChartByDateRange(start, today);
                  setIsCustomFilterActive(false);
                }
                setActiveFilter(label);
              }}
              className={`px-3 py-1 text-sm rounded border ${
                !isCustomFilterActive && activeFilter === label
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border-gray-300"
              }`}
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
          onClick={() => setShowMore(true)}
          className="text-sm text-blue-600 hover:underline"
        >
          More ▾
        </button>
      </div>

      {!isLoadingChart && dailyChart.length > 0 && (
        <TrafficChart
          chartData={chartData}
          showCount={showCount}
          showUnique={showUnique}
          showDuration={showDuration}
          setShowCount={setShowCount}
          setShowUnique={setShowUnique}
          setShowDuration={setShowDuration}
        />
      )}

      {showMore && (
        <MoreModal
          moreTab={moreTab}
          setMoreTab={setMoreTab}
          filterDates={filterDates}
          setFilterDates={setFilterDates}
          compareDates={compareDates}
          setCompareDates={setCompareDates}
          customOption={customOption}
          setCustomOption={setCustomOption}
          compareOption={compareOption}
          setCompareOption={setCompareOption}
          onCancel={handleCancel}
          onApply={handleApply}
          isApplyEnabled={moreTab === "filter" ? isFilterValid : isCompareValid}
        />
      )}

      <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TrafficCard
            label={`Total Visits (${getFilterLabel()})`}
            value={totalVisits.toLocaleString()}
            diff={percentageChange}
          />

          <TrafficCard
            label={`Unique Visitors (${getFilterLabel()})`}
            value={
              activeFilter === "24h" && !isCustomFilterActive
                ? (
                    chartData[chartData.length - 1]?.uniqueVisitors || 0
                  ).toLocaleString()
                : chartData
                    .reduce((sum, d) => sum + (d.uniqueVisitors || 0), 0)
                    .toLocaleString()
            }
            diff={uniqueChange}
          />

          <TrafficCard
            label={`Avg Visit Duration (${getFilterLabel()})`}
            value={avgDurationFormatted}
            diff={durationChange}
          />
        </div>
      </div>
    </div>
  );
};

export default WebTraffic;
