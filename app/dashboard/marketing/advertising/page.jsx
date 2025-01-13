"use client";

import React, { useState, useEffect } from "react";
import { adsData } from "@/data/adsData";
import AdvertisingTable from "@/components/AdsTable/AdsTable";
import QueueAdsTable from "@/components/AdsTable/QueueAdstable";

const AdvertisingPage = () => {
  const [activeAds, setActiveAds] = useState([]);
  const [pendingAds, setPendingAds] = useState([]);

  useEffect(() => {
    // 🔎 Filter data Active dan Pending
    const active = adsData.filter((ad) => ad.status === "Active" || ad.status === "Inactive");
    const pending = adsData.filter((ad) => ad.status === "Pending");

    setActiveAds(active);
    setPendingAds(pending);
  }, []);

  return (
    <div className="p-6 space-y-8">
      {/* 🔵 Active & Inactive Ads */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Active Advertising</h1>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Tambah Advertising
          </button>
        </div>
        <AdvertisingTable ads={activeAds} />
      </div>

      {/* 🟡 Pending Ads */}
      <div>
        <QueueAdsTable ads={pendingAds} />
      </div>
    </div>
  );
};

export default AdvertisingPage;
