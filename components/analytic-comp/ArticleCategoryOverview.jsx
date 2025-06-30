"use client";
import React from "react";
import dayjs from "dayjs";

const ArticleCategoryOverview = ({
  data,
  compareData = {},
  isCompareMode,
  isCustomFilterActive,
  isAutoCompare,
  dateFrom,
  dateTo,
  compareFrom,
  compareTo,
}) => {
  const articles = data?.articles || [];
  const compareArticles = compareData?.articles || [];
  const isCompareActiveFinal =
    Array.isArray(compareArticles) && compareArticles.length > 0;

  const renderDateRange = () => {
    if (!dateFrom || !dateTo) return null;

    const mainRange = `${dayjs(dateFrom).format("DD MMM")} – ${dayjs(
      dateTo
    ).format("DD MMM YYYY")}`;
    const isPreset = !isCustomFilterActive && !isCompareMode;
    const isShortRange = dayjs(dateTo).diff(dayjs(dateFrom), "day");

    // ✅ Preset mode label
    if (isPreset) {
      const label =
        dateFrom === dateTo
          ? "Last 24 hours"
          : isShortRange === 6
          ? "Last 7 days"
          : "Last 28 days";

      return <p className="text-gray-400 text-sm mb-4">{label}</p>;
    }

    // ✅ Compare mode (manual atau otomatis)
    const compareRange =
      isCompareMode && compareFrom && compareTo
        ? `${dayjs(compareFrom).format("DD MMM")} – ${dayjs(compareTo).format(
            "DD MMM YYYY"
          )}`
        : null;

    return (
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-900 text-base">{mainRange}</p>
          {compareRange && (
            <p className="text-sm text-gray-500 mt-1 italic">
              Periode Pembanding ({compareRange})
              {isAutoCompare && (
                <span className="ml-2 text-blue-500">(otomatis)</span>
              )}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        Articles Overview
      </h3>
      {renderDateRange()}
      <div className="max-h-[500px] overflow-y-auto rounded border">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="sticky top-0 bg-white border-b font-medium text-gray-900 z-10">
            <tr>
              <th className="py-2 px-3 2xl:text-sm xl:text-sm lg:text-xs text-xs">No</th>
              <th className="py-2 px-3 2xl:text-sm xl:text-sm lg:text-xs text-xs">Judul Artikel</th>
              <th className="py-2 px-3 2xl:text-sm xl:text-sm lg:text-xs text-xs">Author</th>
              <th className="py-2 px-3 2xl:text-sm xl:text-sm lg:text-xs text-xs">Kategori</th>
              <th className="py-2 px-3 2xl:text-sm xl:text-sm lg:text-xs text-xs">Views</th>
              {isCompareActiveFinal && <th className="py-2 px-3 text-nowrap 2xl:text-sm xl:text-sm lg:text-xs text-xs ">% Change</th>}

              <th className="py-2 px-3 text-right text-nowrap 2xl:text-sm xl:text-sm lg:text-xs text-xs">Total Views</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article, idx) => {
              const compareArticle = compareArticles.find(
                (c) => c.articleId === article.articleId
              );
              const viewCount = article.viewCount || 0;
              const compareViewCount = compareArticle?.viewCount || 0;
              const totalCount = article.totalCount || 0;
              const hasValidCompare = compareViewCount > 0;
              const diff = hasValidCompare
                ? ((viewCount - compareViewCount) / compareViewCount) * 100
                : null;

              return (
                <tr
                  key={idx}
                  className="border-b hover:bg-gray-50 2xl:text-sm xl:text-sm lg:text-xs text-xs"
                >
                  <td className="py-2 px-3">{idx + 1}</td>
                  <td className="py-2 px-3">{article.title}</td>
                  <td className="py-2 px-3">{article.authorName || "-"}</td>
                  <td className="py-2 px-3">
                    {article.category?.[0] || "Uncategorized"}
                  </td>
                  <td className="py-2 px-3 text-end">
                    {viewCount.toLocaleString()}
                  </td>
                  {isCompareActiveFinal && (
                    <td
                      className={`py-2 px-3 ${
                        diff >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {diff !== null ? `${diff.toFixed(1)}%` : "–"}
                    </td>
                  )}

                  <td className="py-2 px-3 text-right">
                    {totalCount.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArticleCategoryOverview;
