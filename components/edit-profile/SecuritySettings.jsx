"use client";

import React, { useState, useEffect } from "react";

const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState(null);

  // Ambil data user dari localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    setUser(storedUser);
  }, []);

  // Handle submit untuk ubah password
  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Password baru tidak cocok!");
      return;
    }

    if (currentPassword !== user.password) {
      alert("Password lama salah!");
      return;
    }

    const updatedUser = {
      ...user,
      password: newPassword,
    };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    alert("Password berhasil diubah!");
  };

  if (!user) {
    return <p>Memuat data...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">🔒 Ubah Password</h2>

      {/* Password Lama */}
      <div>
        <label className="block mb-1 font-medium">Password Lama</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Masukkan Password Lama"
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Password Baru */}
      <div>
        <label className="block mb-1 font-medium">Password Baru</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Masukkan Password Baru"
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Konfirmasi Password */}
      <div>
        <label className="block mb-1 font-medium">Konfirmasi Password Baru</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Ulangi Password Baru"
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Tombol Simpan */}
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Simpan Password
      </button>
    </form>
  );
};

export default SecuritySettings;
