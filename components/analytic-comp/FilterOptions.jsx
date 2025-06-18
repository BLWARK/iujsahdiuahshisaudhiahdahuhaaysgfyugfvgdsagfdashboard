import React from "react";
import DateRangeInput from "./DateRangeInput";

const FilterOptions = ({
  customOption,
  setCustomOption,
  filterDates,
  setFilterDates,
}) => (
  <div className="space-y-2 text-sm">
    {["3month", "6month", "custom"].map((opt) => (
      <label key={opt} className="flex items-center gap-2">
        <input
          type="radio"
          name="filterOption"
          value={opt}
          onChange={() => setCustomOption(opt)}
          checked={customOption === opt}
        />
        {opt === "3month"
          ? "Last 3 Months"
          : opt === "6month"
          ? "Last 6 Months"
          : "Custom Range"}
      </label>
    ))}

    {customOption === "custom" && (
      <div className="flex gap-3 mt-2">
        <DateRangeInput
          label="Start Date"
          value={filterDates.start}
          onChange={(e) =>
            setFilterDates((prev) => {
              const newStart = e.target.value;
              const shouldResetEnd =
                prev.end && new Date(prev.end) < new Date(newStart);
              return {
                ...prev,
                start: newStart,
                end: shouldResetEnd ? "" : prev.end,
              };
            })
          }
        />
        <DateRangeInput
          label="End Date"
          value={filterDates.end}
          onChange={(e) =>
            setFilterDates((prev) => ({ ...prev, end: e.target.value }))
          }
          min={filterDates.start}
        />
      </div>
    )}
  </div>
);

export default FilterOptions;
