import dayjs from "dayjs";

export const getValidDates = (range) => {
  return Array.from({ length: range + 1 }, (_, i) =>
    dayjs().subtract(i, "day").format("YYYY-MM-DD")
  );
};
