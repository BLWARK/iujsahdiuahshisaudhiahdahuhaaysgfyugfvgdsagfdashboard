// /app/dashboard/recycle-bin/page.jsx

import React from "react";
import RecycleBinTable from "@/components/Recyclebin/RecyclebinTable";
import { recycleBinArticles } from "@/data/recycleBinData";

const RecycleBinPage = () => {
  return <RecycleBinTable articles={recycleBinArticles} />;
};

export default RecycleBinPage;
