import React from "react";

const DateRangeInput = ({ label, value, onChange, min }) => (
  <div>
    <label className="block text-sm text-gray-600">{label}</label>
    <input
      type="date"
      className="border border-gray-300 p-2 rounded w-full"
      value={value}
      onChange={onChange}
      min={min} // ✅ Batas minimum tanggal (digunakan di end date)
    />
  </div>
);

export default DateRangeInput;
