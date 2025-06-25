"use client";
import React, { useState, useEffect, useContext, useMemo } from "react";
import TrafficCard from "@/components/analytic-comp/TrafficCard";
import TrafficChart from "@/components/analytic-comp/TrafficChart";
import TrafficChannelOverview from "@/components/TrafficChannelOverview";
import MoreModal from "@/components/analytic-comp/MoreModal";
import { calculatePercentageChange } from "@/utils/calculatePercentageChange";
import { calculatePercentageChangeBetweenRanges } from "@/utils/calculatePercentageChangeBetweenRanges";
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
    setDailyChart,
    getReferrerComparisonSources,
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
  const [compareChartData, setCompareChartData] = useState([]);
  const [compareReferrerData, setCompareReferrerData] = useState([]); // ✅ NEW
  

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

  const handleApply = async () => {
  setShowMore(false);
  if (!selectedPortal?.platform_id) return;

  if (moreTab === "compare") {
  if (
    compareOption === "custom" &&
    compareDates.start &&
    compareDates.end &&
    compareDates.compareStart &&
    compareDates.compareEnd
  ) {
    const from1 = dayjs(compareDates.start).format("YYYY-MM-DD");
    const to1 = dayjs(compareDates.end).format("YYYY-MM-DD");
    const from2 = dayjs(compareDates.compareStart).format("YYYY-MM-DD");
    const to2 = dayjs(compareDates.compareEnd).format("YYYY-MM-DD");

    // Ambil daily chart
    const mainData = await getDailyChartByDateRange(from1, to1);
    const vsData = await getDailyChartByDateRange(from2, to2);

    setDailyChart(mainData);              // chart utama
    setCompareChartData(vsData);          // chart pembanding

    // Ambil referrer comparison
    const result = await getReferrerComparisonSources(from1, to1, from2, to2);
    if (result?.compare) {
      setCompareReferrerData(result.compare); // ⬅️ simpan ke state baru
    }
  } else {
    getWeeklyProgress();
  }
}
 else {
    // MODE FILTER
    if (customOption === "custom" && filterDates.start && filterDates.end) {
      const start = dayjs(filterDates.start);
      const end = dayjs(filterDates.end);
      const rangeLength = end.diff(start, "day") + 1;

      const extendedStart = start
        .subtract(rangeLength, "day")
        .format("YYYY-MM-DD");
      const extendedEnd = end.format("YYYY-MM-DD");

      await getDailyChartByDateRange(extendedStart, extendedEnd);
      setIsCustomFilterActive(true);
      setCompareChartData([]); // reset compare
    } else if (["3month", "6month"].includes(customOption)) {
      getMonthlyChart();
      setIsCustomFilterActive(true);
      setCompareChartData([]);
    } else {
      setIsCustomFilterActive(false);
      setCompareChartData([]);
    }
  }
};




  const getCompareDateRange = () => {
  if (
    compareDates.compareStart &&
    compareDates.compareEnd
  ) {
    return {
      from: compareDates.compareStart,
      to: compareDates.compareEnd,
    };
  }

  return { from: "", to: "" };
};


  const { from: compareFrom, to: compareTo } = getCompareDateRange(); // compare





  const isCompareMode =
    moreTab === "compare" &&
    Array.isArray(compareChartData) &&
    compareChartData.length > 0;

  const chartData = useMemo(() => {
    if (isCompareMode && compareDates.start && compareDates.end) {
      return dailyChart
        ?.filter((d) =>
          dayjs(d.date).isBetween(
            compareDates.start,
            compareDates.end,
            null,
            "[]"
          )
        )
        .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
    }

    // default: non compare mode
    if (isCustomFilterActive && filterDates.start && filterDates.end) {
      return dailyChart
        ?.filter((d) =>
          dayjs(d.date).isBetween(
            filterDates.start,
            filterDates.end,
            null,
            "[]"
          )
        )
        .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
    }

    const range = activeFilter === "24h" ? 6 : activeFilter === "7d" ? 6 : 27;
    const validDates = getValidDates(range);
    return dailyChart
      ?.filter((d) => validDates.includes(d.date))
      .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
  }, [
    dailyChart,
    compareDates,
    filterDates,
    activeFilter,
    isCustomFilterActive,
    isCompareMode,
  ]);


   

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

  const compareVisitChange = useMemo(() => {
    if (!isCompareMode) return 0;
    return calculatePercentageChangeBetweenRanges(
      chartData,
      compareChartData,
      "totalVisitors"
    );
  }, [chartData, compareChartData, isCompareMode]);

  const compareUniqueChange = useMemo(() => {
    if (!isCompareMode) return 0;
    return calculatePercentageChangeBetweenRanges(
      chartData,
      compareChartData,
      "uniqueVisitors"
    );
  }, [chartData, compareChartData, isCompareMode]);

  const compareDurationChange = useMemo(() => {
    if (!isCompareMode) return 0;
    return calculatePercentageChangeBetweenRanges(
      chartData,
      compareChartData,
      "duration"
    );
  }, [chartData, compareChartData, isCompareMode]);

  const compareTotalVisit = useMemo(() => {
    if (!isCompareMode) return 0;
    return compareChartData.reduce((sum, d) => sum + (d.totalVisitors || 0), 0);
  }, [compareChartData, isCompareMode]);

  const compareUniqueVisit = useMemo(() => {
    if (!isCompareMode) return 0;
    return compareChartData.reduce(
      (sum, d) => sum + (d.uniqueVisitors || 0),
      0
    );
  }, [compareChartData, isCompareMode]);

  const compareDurationValue = useMemo(() => {
    if (!isCompareMode) return "00:00:00";
    const valid = compareChartData.filter((d) => d.duration > 0);
    const total = valid.reduce((sum, d) => sum + d.duration, 0);
    const avg = total / (valid.length || 1);
    return dayjs.duration(Math.floor(avg), "seconds").format("HH:mm:ss");
  }, [compareChartData, isCompareMode]);

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

  const getActiveDateRange = () => {
    if (isCompareMode) {
      return {
        from: compareDates.start,
        to: compareDates.end,
      };
    }

    if (isCustomFilterActive && filterDates.start && filterDates.end) {
      return {
        from: filterDates.start,
        to: filterDates.end,
      };
    }

    const today = dayjs().format("YYYY-MM-DD");

    if (activeFilter === "24h") {
      return { from: today, to: today };
    }

    if (activeFilter === "7d") {
      return {
        from: dayjs().subtract(6, "day").format("YYYY-MM-DD"),
        to: today,
      };
    }

    if (activeFilter === "28d") {
      return {
        from: dayjs().subtract(27, "day").format("YYYY-MM-DD"),
        to: today,
      };
    }

    return { from: today, to: today };
  };

  const { from: dateFrom, to: dateTo } = getActiveDateRange();


   useEffect(() => {
  const fetchComparison = async () => {
    if (!isCompareMode) return;

    const result = await getReferrerComparisonSources(
      dateFrom,
      dateTo,
      compareFrom,
      compareTo
    );

    if (result?.compare) {
      setCompareReferrerData(result.compare); // ✅ hanya untuk referrer
    }
  };

  fetchComparison();
}, [isCompareMode, dateFrom, dateTo, compareFrom, compareTo]);


  return (
    <div className="2xl:pl-6 xl:pl-6 lg:pl-6 p-4   relative">
      <h2 className="2xl:text-2xl xl:text-xl lg:text-xl text-xl font-bold text-gray-800">
        Traffic & Engagement
      </h2>
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
        if (label === "24h") getDailyChart(selectedPortal?.platform_id);
        else getDailyChartByDateRange(start, today);
        setIsCustomFilterActive(false);
      }
      setCompareChartData([]);
      setActiveFilter(label);
    }}
    disabled={showMore} // 🔒 disable saat modal aktif
    className={`px-3 py-1 text-sm rounded border ${
      !isCustomFilterActive && activeFilter === label
        ? "bg-blue-600 text-white"
        : "bg-white text-gray-600 border-gray-300"
    } ${showMore ? "opacity-50 cursor-not-allowed" : ""}`} // 🔒 visual nonaktif
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

      {!isLoadingChart &&
        Array.isArray(dailyChart) &&
        dailyChart.length > 0 && (
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

      <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TrafficCard
            label={`Total Visits`}
            // value={`1.378.445`}
            value={totalVisits.toLocaleString()}
            diff={isCompareMode ? compareVisitChange : percentageChange}
            subLabel={
              isCompareMode &&
              compareDates.compareStart &&
              compareDates.compareEnd ? (
                <>
                  <span className="block text-gray-400 text-sm italic">
                    {`${dayjs(compareDates.start).format("DD MMM")} – ${dayjs(
                      compareDates.end
                    ).format("DD MMM YYYY")}`}
                  </span>
                  <span className="block text-blue-600 font-bold text-2xl mt-5 ">
                    {compareTotalVisit.toLocaleString()}
                  </span>

                  <span className="block text-gray-400 italic text-sm">
                    {`${dayjs(compareDates.compareStart).format(
                      "DD MMM"
                    )} – ${dayjs(compareDates.compareEnd).format(
                      "DD MMM YYYY"
                    )}`}
                  </span>
                </>
              ) : (
                getFilterLabel()
              )
            }
          />

          <TrafficCard
            label={`Unique Visitors`}
            value={
              activeFilter === "24h" && !isCustomFilterActive
                ? (
                    chartData[chartData.length - 1]?.uniqueVisitors || 0
                  ).toLocaleString()
                : chartData
                    .reduce((sum, d) => sum + (d.uniqueVisitors || 0), 0)
                    .toLocaleString()
            }
            //  value={`122.556`

            // }
            diff={isCompareMode ? compareUniqueChange : uniqueChange}
            subLabel={
              isCompareMode &&
              compareDates.compareStart &&
              compareDates.compareEnd ? (
                <>
                  <span className="block text-gray-400 text-sm italic">
                    {`${dayjs(compareDates.start).format("DD MMM")} – ${dayjs(
                      compareDates.end
                    ).format("DD MMM YYYY")}`}
                  </span>
                  <span className="block text-green-600 font-bold text-2xl mt-5">
                    {compareUniqueVisit.toLocaleString()}
                  </span>
                  <span className="block text-gray-400 italic text-sm">
                    {`${dayjs(compareDates.compareStart).format(
                      "DD MMM"
                    )} – ${dayjs(compareDates.compareEnd).format(
                      "DD MMM YYYY"
                    )}`}
                  </span>
                </>
              ) : (
                getFilterLabel()
              )
            }
          />

          <TrafficCard
            label={`Avg Visit Duration`}
            // value={`00:07:22`}
            value={avgDurationFormatted}
            diff={isCompareMode ? compareDurationChange : durationChange}
            subLabel={
              isCompareMode &&
              compareDates.compareStart &&
              compareDates.compareEnd ? (
                <>
                  <span className="block text-gray-400 text-sm italic">
                    {`${dayjs(compareDates.start).format("DD MMM")} – ${dayjs(
                      compareDates.end
                    ).format("DD MMM YYYY")}`}
                  </span>
                  <span className="block text-orange-500 font-bold text-2xl mt-5">
                    {compareDurationValue}
                  </span>
                  <span className="block text-gray-400 italic text-sm">
                    {`${dayjs(compareDates.compareStart).format(
                      "DD MMM"
                    )} – ${dayjs(compareDates.compareEnd).format(
                      "DD MMM YYYY"
                    )}`}
                  </span>
                </>
              ) : (
                getFilterLabel()
              )
            }
          />
        </div>
      </div>
      <TrafficChannelOverview
  dateFrom={dateFrom}
  dateTo={dateTo}
  isCompareMode={isCompareMode}
  compareChartData={compareReferrerData} // ✅ gunakan referrerData
/>

    </div>
  );
};

export default WebTraffic;
