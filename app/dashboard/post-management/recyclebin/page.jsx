// /app/dashboard/recycle-bin/page.jsx

import React from "react";
import RecycleBinTable from "@/components/Recyclebin/RecyclebinTable";
import { recycleBinArticles } from "@/data/recycleBinData";

const RecycleBinPage = () => {
  return <div className="p-6 space-y-6 "><RecycleBinTable articles={recycleBinArticles} /></div>;
};

export default RecycleBinPage;
