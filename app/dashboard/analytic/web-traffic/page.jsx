"use client";
import React, { useState, useEffect, useContext, useMemo } from "react";
import TrafficChannelOverview from "@/components/analytic-comp/TrafficChannelOverview";
import TopCategoryOverview from "@/components/analytic-comp/TopCategoryOverview";
import FilterButtons from "@/components/analytic-comp/FilterButtons";
import ChartSection from "@/components/analytic-comp/ChartSection";
import TrafficCardsSection from "@/components/analytic-comp/TrafficCardsSection";
import ArticleCategoryOverview from "@/components/analytic-comp/ArticleCategoryOverview";
import { calculatePercentageChange } from "@/utils/calculatePercentageChange";
import { calculatePercentageChangeBetweenRanges } from "@/utils/calculatePercentageChangeBetweenRanges";
import { getValidDates } from "@/utils/generateDateRange";
import { BackContext } from "@/context/BackContext";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(duration);
dayjs.extend(isBetween);

const getAutoComparisonDates = (from, to) => {
  const start = dayjs(from);
  const end = dayjs(to);
  const rangeLength = end.diff(start, "day") + 1;

  const compareEnd = start.subtract(1, "day");
  const compareStart = compareEnd.subtract(rangeLength - 1, "day");

  return {
    compareFrom: compareStart.format("YYYY-MM-DD"),
    compareTo: compareEnd.format("YYYY-MM-DD"),
  };
};


const WebTraffic = () => {
  const {
    setSelectedPortal,
    selectedPortal,
    getDailyChart,
    getMonthlyChart,
    getWeeklyProgress,
    dailyChart,
    isLoadingChart,
    getDailyChartByDateRange,
    setDailyChart,
    getReferrerComparisonSources,
    getTopCategoriesByRange,
    getArticlesByCategoryRange,
    getArticlesCategoryComparison,
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
  const [articleCategories, setArticleCategories] = useState([]);
  const [compareArticleCategories, setCompareArticleCategories] = useState([]);

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

        setDailyChart(mainData); // chart utama
        setCompareChartData(vsData); // chart pembanding

        // Ambil referrer comparison
        const result = await getReferrerComparisonSources(
          from1,
          to1,
          from2,
          to2
        );
        if (result?.compare) {
          setCompareReferrerData(result.compare); // ⬅️ simpan ke state baru
        }
      } else {
        getWeeklyProgress();
      }
    } else {
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
    if (compareDates.compareStart && compareDates.compareEnd) {
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

  useEffect(() => {
  const fetchArticleData = async () => {
    if (!dateFrom || !dateTo) return;

    // Jika mode compare (manual dari MoreModal)
    if (isCompareMode && compareFrom && compareTo) {
      const res = await getArticlesCategoryComparison(
        dateFrom,
        dateTo,
        compareFrom,
        compareTo
      );
      setArticleCategories(res.main || []);
      setCompareArticleCategories(res.compare || []);
      return;
    }

    // ⬇️ Jika bukan compare manual, kita aktifkan auto-comparison
    const data = await getArticlesByCategoryRange(dateFrom, dateTo);
    setArticleCategories(data || []);

    // hitung pembanding otomatis
    const { compareFrom, compareTo } = getAutoComparisonDates(dateFrom, dateTo);
    const res = await getArticlesCategoryComparison(
      dateFrom,
      dateTo,
      compareFrom,
      compareTo
    );
    setCompareArticleCategories(res.compare || []);
  };

  fetchArticleData();
}, [dateFrom, dateTo, compareFrom, compareTo, isCompareMode]);

  const isCompareActive =
    compareDates?.start &&
    compareDates?.end &&
    compareDates?.compareStart &&
    compareDates?.compareEnd;

  return (
    <div className="2xl:pl-6 xl:pl-6 lg:pl-6 p-4   relative">
      <h2 className="2xl:text-2xl xl:text-xl lg:text-xl text-xl font-bold text-gray-800">
        Traffic & Engagement
      </h2>
      <FilterButtons
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        showMore={showMore}
        setShowMore={setShowMore}
        getDailyChart={getDailyChart}
        getDailyChartByDateRange={getDailyChartByDateRange}
        selectedPortal={selectedPortal}
        setIsCustomFilterActive={setIsCustomFilterActive}
        setCompareChartData={setCompareChartData}
        isCustomFilterActive={isCustomFilterActive}
        isCompareMode={isCompareMode} // ✅ pastikan prop ini dikirim
      />

      {!isLoadingChart &&
        Array.isArray(dailyChart) &&
        dailyChart.length > 0 && (
          <ChartSection
            chartData={chartData}
            showMore={showMore}
            setShowMore={setShowMore}
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
            onApply={handleApply}
            onCancel={handleCancel}
            isApplyEnabled={
              moreTab === "filter" ? isFilterValid : isCompareValid
            }
            showCount={showCount}
            showUnique={showUnique}
            showDuration={showDuration}
            setShowCount={setShowCount}
            setShowUnique={setShowUnique}
            setShowDuration={setShowDuration}
            dailyChart={dailyChart}
            isLoadingChart={isLoadingChart}
          />
        )}

      <TrafficCardsSection
        totalVisits={totalVisits}
        compareVisitChange={compareVisitChange}
        compareUniqueChange={compareUniqueChange}
        compareDurationChange={compareDurationChange}
        percentageChange={percentageChange}
        compareTotalVisit={compareTotalVisit}
        compareUniqueVisit={compareUniqueVisit}
        compareDurationValue={compareDurationValue}
        uniqueChange={uniqueChange}
        durationChange={durationChange}
        avgDurationFormatted={avgDurationFormatted}
        chartData={chartData}
        activeFilter={activeFilter}
        isCompareMode={isCompareMode}
        compareDates={compareDates}
        getFilterLabel={getFilterLabel}
      />

      <TrafficChannelOverview
        dateFrom={dateFrom}
        dateTo={dateTo}
        compareFrom={compareFrom}
        compareTo={compareTo}
        isCompareMode={isCompareMode}
        compareChartData={compareReferrerData}
      />

      <TopCategoryOverview
        isCompareActive={isCompareMode}
        dateFrom={dateFrom}
        dateTo={dateTo}
        compareFrom={compareFrom}
        compareTo={compareTo}
      />

      <ArticleCategoryOverview
        data={articleCategories}
        compareData={compareArticleCategories}
        isCompareMode={isCompareMode}
        dateFrom={dateFrom}
        dateTo={dateTo}
        compareFrom={compareFrom}
        compareTo={compareTo}
         isCustomFilterActive={isCustomFilterActive}
         isAutoCompare={!isCompareMode && compareArticleCategories.length > 0}
      />
    </div>
  );
};

export default WebTraffic;
