import dayjs from "dayjs";

export const calculatePercentageChange = (data, activeFilter, key, filterDates = null) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  let current = [];
  let previous = [];

  if (filterDates?.start && filterDates?.end) {
    const start = dayjs(filterDates.start);
    const end = dayjs(filterDates.end);
    const rangeLength = end.diff(start, "day") + 1;

    const prevStart = start.subtract(rangeLength, "day");
    const prevEnd = end.subtract(rangeLength, "day");

    current = data.filter((d) =>
      dayjs(d.date).isBetween(start, end, null, "[]")
    );

    previous = data.filter((d) =>
      dayjs(d.date).isBetween(prevStart, prevEnd, null, "[]")
    );
  } else {
    const today = dayjs();
if (activeFilter === "24h") {
  const today = dayjs().format("YYYY-MM-DD");
  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

  const currentValue = data.find((d) => d.date === today)?.[key] || 0;
  const previousValue = data.find((d) => d.date === yesterday)?.[key] || 0;

  if (previousValue === 0) return currentValue > 0 ? 100 : 0;

  const change = ((currentValue - previousValue) / previousValue) * 100;
  return parseFloat(change.toFixed(2));
}
 else {
  const slice = {
    "7d": 7,
    "28d": 28,
  }[activeFilter] || 7;

  const currentStart = today.subtract(slice - 1, "day");
  const currentEnd = today;
  const prevStart = currentStart.subtract(slice, "day");
  const prevEnd = currentStart.subtract(1, "day");

  current = data.filter((d) =>
    dayjs(d.date).isBetween(currentStart, currentEnd, null, "[]")
  );
  previous = data.filter((d) =>
    dayjs(d.date).isBetween(prevStart, prevEnd, null, "[]")
  );
}

  }

  const sum = (arr) => arr.reduce((sum, d) => sum + (d[key] || 0), 0);

  const currentSum = sum(current);
  const previousSum = sum(previous);

  if (previous.length === 0 || previousSum === 0) return null;

  const change = ((currentSum - previousSum) / previousSum) * 100;
  return parseFloat(change.toFixed(2));
};
