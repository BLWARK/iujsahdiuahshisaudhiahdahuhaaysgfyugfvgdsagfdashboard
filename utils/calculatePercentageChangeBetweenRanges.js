// utils/calculatePercentageChangeBetweenRanges.js

export function calculatePercentageChangeBetweenRanges(dataA = [], dataB = [], key = "totalVisitors") {
  const totalA = dataA.reduce((sum, d) => sum + (d[key] || 0), 0);
  const totalB = dataB.reduce((sum, d) => sum + (d[key] || 0), 0);

  if (totalB === 0) return 0;

  const diff = ((totalA - totalB) / totalB) * 100;
  return Math.round(diff);
}
