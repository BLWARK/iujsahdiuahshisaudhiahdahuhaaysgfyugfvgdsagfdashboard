"use client";

import React, { useContext, useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { BackContext } from "@/context/BackContext";

const TopCategoryCompare = ({ range1, range2 }) => {
  const { getTopCategoryComparison } = useContext(BackContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!range1?.dateFrom || !range2?.dateFrom) return;

    const fetchCompare = async () => {
      const result = await getTopCategoryComparison(range1, range2);
      setData(result);
    };

    fetchCompare();
  }, [range1, range2]);

  return (
    <div className="w-full h-[320px] bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-bold text-gray-700 mb-4">Perbandingan Top Kategori</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
          <XAxis type="number" />
          <YAxis type="category" dataKey="category_name" />
          <Tooltip />
          <Legend />
          <Bar dataKey="current" name="Periode Sekarang" />
          <Bar dataKey="previous" name="Periode Banding" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopCategoryCompare;
