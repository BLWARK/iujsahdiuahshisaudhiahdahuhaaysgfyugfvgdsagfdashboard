import React from "react";
import DraftTable from "@/components/DraftTable/DraftTable";
import { draftArticles } from "@/data/draftArticlesData";

const DraftPage = () => {
  return (
    <div className="p-6">
      <DraftTable articles={draftArticles} />
    </div>
  );
};

export default DraftPage;
