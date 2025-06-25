import React from "react";
import dayjs from "dayjs";


const TrafficCard = ({ label, value, diff, subLabel, compareValue }) => {
  const colorMap = {
    Visits: "text-blue-600",
    "Unique Visitors": "text-green-600",
    "Avg Visit Duration": "text-orange-500",
  };

  const valueColor =
    label.includes("Duration")
      ? colorMap["Avg Visit Duration"]
      : label.includes("Unique")
      ? colorMap["Unique Visitors"]
      : label.includes("Visit")
      ? colorMap["Visits"]
      : "text-gray-800";

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg shadow-gray-200  flex flex-col">
      <h3 className="text-sm text-gray-500">{label}</h3>

      {/* Current Value */}
      <p className={`text-2xl mt-2 font-bold ${valueColor}`}>{value}</p>
      {subLabel && <p className="text-xs text-gray-400 italic">{subLabel}</p>}

      {/* Compare Value (jika ada) */}
      {typeof compareValue !== "undefined" && (
        <>
          <p className={`text-xl font-semibold ${valueColor}`}>{compareValue}</p>
          <p className="text-xs text-gray-400 italic">
            {dayjs().format("DD MMM YYYY")} 
          </p>
        </>
      )}

      {/* Persentase perubahan */}
      {typeof diff === "number" ? (
        <p className={`text-sm ${diff < 0 ? "text-red-500" : "text-green-600"}`}>
          {diff < 0 ? "↓" : "↑"} {Math.abs(diff)}% from previous period
        </p>
      ) : (
        <p className="text-sm text-gray-400">No previous data</p>
      )}
    </div>
  );
};


export default TrafficCard;
