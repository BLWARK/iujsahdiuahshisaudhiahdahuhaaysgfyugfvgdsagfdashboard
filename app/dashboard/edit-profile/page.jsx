"use client";

import React, { useState } from "react";
import EditProfileForm from "@/components/edit-profile/EditProfileForm";
import SecuritySettings from "@/components/edit-profile/SecuritySettings";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pengaturan Akun</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "profile"
              ? "bg-pink-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Edit Profil
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "security"
              ? "bg-pink-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Keamanan
        </button>
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {activeTab === "profile" ? <EditProfileForm /> : <SecuritySettings />}
      </div>
    </div>
  );
};

export default ProfilePage;
