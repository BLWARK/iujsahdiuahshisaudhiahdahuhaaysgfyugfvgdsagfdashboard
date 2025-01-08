"use client";

import React, { useState } from "react";
import { adsData } from "@/data/adsData";
import AdvertisingTable from "@/components/AdsTable/AdsTable";

const AdvertisingPage = () => {
  const [ads, setAds] = useState(adsData);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Advertising</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Tambah Advertising
        </button>
      </div>
      <AdvertisingTable ads={ads} />
    </div>
  );
};

export default AdvertisingPage;
