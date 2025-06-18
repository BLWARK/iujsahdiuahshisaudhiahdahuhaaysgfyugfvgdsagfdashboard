import React from "react";

const TrafficCard = ({ label, value, diff }) => {
  const colorMap = {
    Visits: "text-blue-600",
    "Unique Visitors": "text-green-600",
    "Avg Visit Duration": "text-orange-500",
  };

  // Tentukan warna berdasarkan isi label
  const valueColor =
    label.includes("Duration")
      ? colorMap["Avg Visit Duration"]
      : label.includes("Unique")
      ? colorMap["Unique Visitors"]
      : label.includes("Visit")
      ? colorMap["Visits"]
      : "text-gray-800";

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg shadow-gray-200 gap-2 flex flex-col">
      <h3 className="text-sm text-gray-500">{label}</h3>
      <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
      {typeof diff === "number" ? (
        <p
          className={`text-sm ${
            diff < 0 ? "text-red-500" : "text-green-600"
          }`}
        >
          {diff < 0 ? "↓" : "↑"} {Math.abs(diff)}% from previous period
        </p>
      ) : (
        <p className="text-sm text-gray-400">No previous data</p>
      )}
    </div>
  );
};

export default TrafficCard;
