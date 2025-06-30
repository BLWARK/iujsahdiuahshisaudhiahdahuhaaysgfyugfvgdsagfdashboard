"use client";
import React from "react";
import TrafficChannelOverview from "@/components/analytic-comp/TrafficChannelOverview";

const TrafficChannelSection = ({
  dateFrom,
  dateTo,
  compareFrom,
  compareTo,
  isCompareMode,
  compareChartData,
}) => {
  return (
    <TrafficChannelOverview
      dateFrom={dateFrom}
      dateTo={dateTo}
      compareFrom={compareFrom}
      compareTo={compareTo}
      isCompareMode={isCompareMode}
      compareChartData={compareChartData}
    />
  );
};

export default TrafficChannelSection;
