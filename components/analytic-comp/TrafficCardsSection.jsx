"use client";
import React from "react";
import TrafficCard from "@/components/analytic-comp/TrafficCard";
import dayjs from "dayjs";

const TrafficCardsSection = ({
  totalVisits,
  compareVisitChange,
  compareUniqueChange,
  compareDurationChange,
  compareTotalVisit,
  compareUniqueVisit,
  compareDurationValue,
  percentageChange,
  uniqueChange,
  durationChange,
  avgDurationFormatted,
  chartData,
  activeFilter,
  isCompareMode,
  compareDates,
  getFilterLabel,
}) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Visits */}
       <TrafficCard
  label="Total Visits"
  value={totalVisits.toLocaleString()}
  diff={
    typeof (isCompareMode ? compareVisitChange : percentageChange) === "number"
      ? (isCompareMode ? compareVisitChange : percentageChange)
      : 0
  }
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
        <span className="block text-blue-600 font-bold text-2xl mt-5">
          {compareTotalVisit.toLocaleString()}
        </span>
        <span className="block text-gray-400 italic text-sm">
          {`${dayjs(compareDates.compareStart).format(
            "DD MMM"
          )} – ${dayjs(compareDates.compareEnd).format("DD MMM YYYY")}`}
        </span>
      </>
    ) : (
      getFilterLabel()
    )
  }
/>


        {/* Unique Visitors */}
        <TrafficCard
          label="Unique Visitors"
          value={
            activeFilter === "24h"
              ? (chartData[chartData.length - 1]?.uniqueVisitors || 0).toLocaleString()
              : chartData
                  .reduce((sum, d) => sum + (d.uniqueVisitors || 0), 0)
                  .toLocaleString()
          }
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
                  {`${dayjs(compareDates.compareStart).format("DD MMM")} – ${dayjs(
                    compareDates.compareEnd
                  ).format("DD MMM YYYY")}`}
                </span>
              </>
            ) : (
              getFilterLabel()
            )
          }
        />

        {/* Avg Visit Duration */}
        <TrafficCard
          label="Avg Visit Duration"
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
                  {`${dayjs(compareDates.compareStart).format("DD MMM")} – ${dayjs(
                    compareDates.compareEnd
                  ).format("DD MMM YYYY")}`}
                </span>
              </>
            ) : (
              getFilterLabel()
            )
          }
        />
      </div>
    </div>
  );
};

export default TrafficCardsSection;
