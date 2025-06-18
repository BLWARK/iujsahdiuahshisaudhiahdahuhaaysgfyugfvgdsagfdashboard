import React from "react";
import DateRangeInput from "./DateRangeInput";

const CompareOptions = ({ compareOption, setCompareOption, compareDates, setCompareDates }) => (
  <div className="space-y-2 text-sm">
    {["7d", "28d", "3m", "custom"].map((opt) => (
      <label key={opt} className="flex items-center gap-2">
        <input
          type="radio"
          name="compareOption"
          value={opt}
          onChange={() => setCompareOption(opt)}
          checked={compareOption === opt}
        />
        {opt === "7d"
          ? "Previous 7 days"
          : opt === "28d"
          ? "Previous 28 days"
          : opt === "3m"
          ? "Previous 3 months"
          : "Custom Range"}
      </label>
    ))}

    {compareOption === "custom" && (
      <div className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4 items-end">
          <DateRangeInput
            label="Start date"
            value={compareDates.start}
            onChange={(e) =>
              setCompareDates((prev) => ({ ...prev, start: e.target.value }))
            }
          />
          <DateRangeInput
            label="End date"
            value={compareDates.end}
            onChange={(e) =>
              setCompareDates((prev) => ({ ...prev, end: e.target.value }))
            }
          />
        </div>
        <p className="text-center text-sm text-gray-500">vs.</p>
        <div className="grid grid-cols-2 gap-4 items-end">
          <DateRangeInput
            label="Start date"
            value={compareDates.compareStart}
            onChange={(e) =>
              setCompareDates((prev) => ({ ...prev, compareStart: e.target.value }))
            }
          />
          <DateRangeInput
            label="End date"
            value={compareDates.compareEnd}
            onChange={(e) =>
              setCompareDates((prev) => ({ ...prev, compareEnd: e.target.value }))
            }
          />
        </div>
      </div>
    )}
  </div>
);

export default CompareOptions;