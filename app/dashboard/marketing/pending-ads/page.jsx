"use client";

import React from "react";
import { pendingAdsData } from "@/data/pendingAdsData";
import PendingAdsTable from "@/components/PendingAdsTable/PendingAdsTable";

const PendingAdsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📋 Persetujuan Iklan</h1>
      <PendingAdsTable ads={pendingAdsData} />
    </div>
  );
};

export default PendingAdsPage;
