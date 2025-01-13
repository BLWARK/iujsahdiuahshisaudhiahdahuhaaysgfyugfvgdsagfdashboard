"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import users from "@/data/users"; // Import data users.js

const EditProfileForm = () => {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("/default-avatar.png");

  // 🔎 Ambil data user dari localStorage saat halaman dimuat
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));

    if (storedUser) {
      // Cari detail user berdasarkan ID di data users
      const detailedUser = users.find((u) => u.id === storedUser.id);

      if (detailedUser) {
        setUser(detailedUser);
        setNickname(detailedUser.nickname || "");
        setPhone(detailedUser.phone || "");
        setAddress(detailedUser.address || "");
        setAvatar(detailedUser.photo || "/default-avatar.png");
      }
    }
  }, []);

  // 🔄 Handle ganti avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newAvatar = URL.createObjectURL(file);
      setAvatar(newAvatar);
    }
  };

  // 💾 Simpan perubahan
  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      nickname,
      phone,
      address,
      photo: avatar,
    };

    // Simpan perubahan di localStorage
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    alert("Profil berhasil diperbarui!");
  };

  if (!user) {
    return <p>Memuat data...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Avatar */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Ubah Avatar</h2>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 relative">
            <Image
              src={avatar}
              alt="Avatar"
              fill
              objectFit="cover" // ✅ Gambar akan di-crop dan menyesuaikan lingkaran
              className="rounded-full border border-gray-300"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="block"
          />
        </div>
      </div>

      {/* Nickname */}
      <div>
        <label className="block mb-1 font-semibold text-main">Nickname</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Masukkan Nickname"
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Email (Terkunci) */}
      <div>
        <label className="block mb-1 font-semibold text-main">Email</label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed text-gray-400"
        />
      </div>

      {/* Nomor HP */}
      <div>
        <label className="block mb-1 font-semibold text-main">Nomor HP</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Masukkan Nomor HP"
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Alamat */}
      <div>
        <label className="block mb-1 font-semibold text-main">Alamat</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Masukkan Alamat"
          rows="3"
          className="w-full p-2 border rounded-md"
        ></textarea>
      </div>

      {/* Tombol Simpan */}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Simpan Perubahan
      </button>
    </form>
  );
};

export default EditProfileForm;
