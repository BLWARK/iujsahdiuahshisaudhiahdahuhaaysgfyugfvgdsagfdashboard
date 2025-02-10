import React from "react";
import { AiOutlineFileDone, AiOutlineCloseCircle, AiOutlineFileSearch } from "react-icons/ai";

const SummaryCard = ({ title, count, icon, color }) => {
  return (
    <div className={`flex items-center p-4 rounded-lg shadow-md ${color}`}>
      {icon}
      <div className="ml-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-2xl font-bold text-white">{count}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
