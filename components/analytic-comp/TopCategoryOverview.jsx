"use client";

import React, { useContext, useEffect, useState } from "react";
import { BackContext } from "@/context/BackContext";
import dayjs from "dayjs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";

// Mapping warna per kategori
const CATEGORY_COLORS = {
  TECHNOLOGY: "#22c55e",
  ENTERTAINTMENT: "#3b82f6",
  Berita: "#ef4444",
  SPORT: "#eab308",
  LIFESTYLE: "#ec4899",
  crypto: "#a855f7",
  business: "#f97316",
  "C-LEVEL": "#a855f7",
  Wisata: "#22c55e",
  Kuliner: "#f97316",
  Budaya: "#ec4899",
  Hukrim: "#ef4444",
  DEFAULT: "#6b7280",
};

const TopCategoryOverview = ({ isCompareActive, dateFrom, dateTo, compareFrom, compareTo, label }) => {

  const { getTopCategoriesByRange, getTopCategoriesComparison } = useContext(BackContext);
  const [mainData, setMainData] = useState([]);
  const [compareData, setCompareData] = useState([]);

  useEffect(() => {
  const fetchData = async () => {
    if (!dateFrom || !dateTo) return;

    if (isCompareActive && compareFrom && compareTo) {
      const { main, compare } = await getTopCategoriesComparison(
        dateFrom,
        dateTo,
        compareFrom,
        compareTo
      );
      setMainData(main);
      setCompareData(compare);
    } else {
      const res = await getTopCategoriesByRange(dateFrom, dateTo);
      setMainData(res?.categories || []);
      setCompareData([]);
    }
  };

  fetchData();
}, [dateFrom, dateTo, isCompareActive, compareFrom, compareTo]);


const getLabelText = (fromStr, toStr) => {
  const from = dayjs(fromStr);
  const to = dayjs(toStr);
  if (!from.isValid() || !to.isValid()) return "";

  if (from.isSame(to, "day")) return "Last 24 hours";
  const diff = to.diff(from, "day");
  if (diff === 6) return "Last 7 days";
  if (diff === 27) return "Last 28 days";
  return `${from.format("DD MMM")} – ${to.format("DD MMM YYYY")}`;
};



  const renderChart = (data) => (
    <ResponsiveContainer width="100%" height={50 * data.length}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
      >
        <XAxis type="number" />
        <YAxis dataKey="categoryName" type="category" width={120} />
        <Tooltip />
        <Bar dataKey="viewCount" radius={[0, 6, 6, 0]}>
          <LabelList dataKey="viewCount" position="right" />
          {data.map((entry, index) => {
            const color = CATEGORY_COLORS[entry.categoryName] || CATEGORY_COLORS.DEFAULT;
            return <Cell key={`cell-${index}`} fill={color} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className="mt-6 p-6 border rounded-lg shadow-sm bg-white">
      <h3 className="text-lg font-bold mb-2 text-gray-800 ">Top Kategori</h3>
      <div className={`grid gap-6 ${isCompareActive ? "grid-cols-2" : "grid-cols-1"}`}>
        <div>
         <h4 className="text-sm font-medium text-gray-500  ">
  <span className="text-gray-400">{getLabelText(dateFrom, dateTo)}</span>
</h4>

{isCompareActive && (
  <h4 className="text-sm font-medium text-gray-500 ">
    Periode Pembanding <span className="text-gray-400">({getLabelText(compareFrom, compareTo)})</span>
  </h4>
)}

          {renderChart(mainData)}
        </div>
        {isCompareActive && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">{getLabelText(compareFrom, compareTo)}</h4>
            {renderChart(compareData)}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopCategoryOverview;
