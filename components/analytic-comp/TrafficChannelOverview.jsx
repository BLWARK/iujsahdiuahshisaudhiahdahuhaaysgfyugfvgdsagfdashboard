"use client";
import React, { useEffect, useState, useContext } from "react";
import { BackContext } from "@/context/BackContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import dayjs from "dayjs";

// Warna per channel
const CHANNEL_COLOR_MAP = {
  Direct: "#1E40AF",
  Organic: "#F97316",
  Paid: "#14B8A6",
  Referrals: "#EAB308",
  Display: "#06B6D4",
  Social: "#9333EA",
  Email: "#EC4899",
  Other: "#9CA3AF",
};

// Mapping referrer name ke channel
const getChannelName = (referrerName) => {
  if (!referrerName || typeof referrerName !== "string") return "Other";
  const name = referrerName.toLowerCase();

  if (referrerName === "Direct Traffic") return "Direct";
  if (name.includes("google.com") || name.includes("chatgpt.com") || name.includes("brave")) return "Organic";
  if (name.includes("facebook") || name.includes("whatsapp")) return "Social";
  if (name.includes("linktr.ee") || name.includes("threads") || name.includes("xyzonemedia")) return "Referrals";
  if (name.includes("email")) return "Email";
  if (name.includes("display")) return "Display";
  return "Other";
};

// Group data referrer jadi channel
const buildChannelData = (referrers) => {
  const grouped = {};
  referrers.forEach((item) => {
    const channel = getChannelName(item.referrerName);
    if (!grouped[channel]) grouped[channel] = 0;
    grouped[channel] += item.visitCount;
  });
  const total = Object.values(grouped).reduce((a, b) => a + b, 0);

  return Object.entries(grouped).map(([name, count]) => ({
    name,
    visitCount: count,
    percentage: total ? +((count / total) * 100).toFixed(1) : 0,
    fill: CHANNEL_COLOR_MAP[name] || CHANNEL_COLOR_MAP.Other,
  }));
};

// 🔧 Custom tooltip
const CustomTooltip = ({ active, payload, label, dateFrom, dateTo, compareFrom, compareTo }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white border shadow p-2 text-sm rounded">
      <div className="font-semibold mb-1">{label}</div>
      {payload.map((entry, index) => {
        const isCurrent = entry.dataKey === "current";
        const dateRange = isCurrent
          ? `${dayjs(dateFrom).format("DD MMM")} – ${dayjs(dateTo).format("DD MMM YYYY")}`
          : `${dayjs(compareFrom).format("DD MMM")} – ${dayjs(compareTo).format("DD MMM YYYY")}`;

        return (
          <div key={index} style={{ color: entry.color }}>
            {isCurrent ? "Current" : "Comparison"} ({dateRange}):{" "}
            {entry.value.toLocaleString()} visits
          </div>
        );
      })}
    </div>
  );
};

const TrafficChannelOverview = ({
  dateFrom,
  dateTo,
  compareFrom,
  compareTo,
  compareChartData = [],
  isCompareMode = false,
}) => {
  const { getReferrerSourcesByRange } = useContext(BackContext);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getReferrerSourcesByRange(dateFrom, dateTo);
      if (!result || !result.referrers) return;

      const mainData = buildChannelData(result.referrers);
      let compareData = [];

      if (isCompareMode && compareChartData.length > 0) {
        compareData = buildChannelData(compareChartData);
      }

      // Gabung data per channel
      const allChannels = [
        ...new Set([...mainData.map((d) => d.name), ...compareData.map((d) => d.name)]),
      ];

      const merged = allChannels.map((name) => {
        const main = mainData.find((d) => d.name === name);
        const compare = compareData.find((d) => d.name === name);
        return {
          name,
          current: main?.visitCount || 0,
          compare: compare?.visitCount || 0,
          currentPercent: main?.percentage || 0,
          comparePercent: compare?.percentage || 0,
          fill: CHANNEL_COLOR_MAP[name] || CHANNEL_COLOR_MAP.Other,
        };
      });

      setChartData(merged);
    };

    fetchData();
  }, [dateFrom, dateTo, compareChartData, isCompareMode]);

  const getLabelText = () => {
    const from = dayjs(dateFrom);
    const to = dayjs(dateTo);
    if (from.isSame(to, "day")) return "Last 24 hours";
    const diff = to.diff(from, "day");
    if (diff === 6) return "Last 7 days";
    if (diff === 27) return "Last 28 days";
    return `${from.format("DD MMM")} – ${to.format("DD MMM YYYY")}`;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-1">Traffic Source</h3>
      <div className="text-sm text-gray-500 mb-4">{getLabelText()}</div>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              content={
                <CustomTooltip
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  compareFrom={compareFrom}
                  compareTo={compareTo}
                />
              }
            />
            <Bar dataKey="current" name="Current" fill="#2563eb">
              <LabelList dataKey="currentPercent" position="top" formatter={(val) => `${val}%`} />
            </Bar>
            {isCompareMode && (
              <Bar dataKey="compare" name="Comparison" fill="#d97706">
                <LabelList dataKey="comparePercent" position="top" formatter={(val) => `${val}%`} />
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrafficChannelOverview;
