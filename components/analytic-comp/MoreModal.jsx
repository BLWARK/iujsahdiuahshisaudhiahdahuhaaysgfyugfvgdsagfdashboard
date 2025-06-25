import React from "react";
import FilterOptions from "./FilterOptions";
import CompareOptions from "./CompareOptions";

const MoreModal = ({
  moreTab,
  setMoreTab,
  filterDates,
  setFilterDates,
  compareDates,
  setCompareDates,
  customOption,
  setCustomOption,
  compareOption,
  setCompareOption,
  onCancel,
  onApply,
  isApplyEnabled,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 2xl:p-0 xl:p-0 lg:p-0 p-4">
    <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-xl">
      <div className="flex gap-4 border-b mb-4 pb-2">
        {["filter", "compare"].map((tab) => (
          <button
            key={tab}
            onClick={() => setMoreTab(tab)}
            className={`font-semibold ${
              moreTab === tab ? "text-blue-600" : "text-gray-600"
            }`}
          >
            {tab === "filter" ? "Filter" : "Compare"}
          </button>
        ))}
      </div>
      {moreTab === "filter" ? (
        <FilterOptions
          customOption={customOption}
          setCustomOption={setCustomOption}
          filterDates={filterDates}
          setFilterDates={setFilterDates}
        />
      ) : (
        <CompareOptions
          compareOption={compareOption}
          setCompareOption={setCompareOption}
          compareDates={compareDates}
          setCompareDates={setCompareDates}
        />
      )}
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          disabled={!isApplyEnabled}
          onClick={onApply}
          className={`px-4 py-2 text-sm rounded ${
            !isApplyEnabled
              ? "bg-gray-300 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Apply
        </button>
      </div>
    </div>
  </div>
);

export default MoreModal;