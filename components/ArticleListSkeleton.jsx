// components/ArticleListSkeleton.jsx
import React from "react";

const ArticleListSkeleton = ({ count = 10 }) => {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse flex items-start gap-4 border-b pb-4"
        >
          <div className="w-32 h-20 bg-gray-200 rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-2/4" />
            <div className="h-3 bg-gray-100 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArticleListSkeleton;
