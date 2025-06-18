import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white border p-2 text-sm shadow rounded">
      <p className="font-semibold">{label}</p>
      {payload.map((entry, index) => {
        let value = entry.value;
        if (entry.dataKey === "duration") {
          value = dayjs.duration(value, "seconds").format("HH:mm:ss");
        }
        return (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {value}
          </p>
        );
      })}
    </div>
  );
};

const TrafficChart = ({
  chartData,
  showCount,
  showUnique,
  showDuration,
  setShowCount,
  setShowUnique,
  setShowDuration,
}) => {
  return (
    <div className="w-full h-[350px] bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex gap-4 items-center mb-2 text-sm">
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={showCount}
            onChange={() => setShowCount(!showCount)}
            className="accent-blue-600"
          />
          Visits
        </label>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={showUnique}
            onChange={() => setShowUnique(!showUnique)}
            className="accent-green-600"
          />
          Unique Visitors
        </label>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={showDuration}
            onChange={() => setShowDuration(!showDuration)}
            className="accent-orange-500"
          />
          Duration
        </label>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip content={<CustomTooltip />} />

          {showCount && (
            <Line
              type="monotone"
              dataKey="totalVisitors"
              stroke="#3182ce"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Visits"
            />
          )}

          {showUnique && (
            <Line
              type="monotone"
              dataKey="uniqueVisitors"
              stroke="#38a169"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Unique Visitors"
            />
          )}

          {showDuration && (
            <Line
              type="monotone"
              dataKey="duration"
              stroke="#ed8936"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Avg Duration"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrafficChart;
