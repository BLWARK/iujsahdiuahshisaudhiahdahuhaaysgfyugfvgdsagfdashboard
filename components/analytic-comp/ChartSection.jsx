"use client";
import React from "react";
import TrafficChart from "@/components/analytic-comp/TrafficChart";
import MoreModal from "@/components/analytic-comp/MoreModal";

const ChartSection = ({
  chartData,
  showMore,
  setShowMore,
  moreTab,
  setMoreTab,
  filterDates,
  setFilterDates,
  compareDates,
  setCompareDates,
  customOption,
  setCustomOption,
  compareOption,
  setCompareOption,
  onApply,
  onCancel,
  isApplyEnabled,
  showCount,
  showUnique,
  showDuration,
  setShowCount,
  setShowUnique,
  setShowDuration,
  dailyChart,
  isLoadingChart,
}) => {
  return (
    <>
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
          onCancel={onCancel}
          onApply={onApply}
          isApplyEnabled={isApplyEnabled}
        />
      )}
    </>
  );
};

export default ChartSection;
