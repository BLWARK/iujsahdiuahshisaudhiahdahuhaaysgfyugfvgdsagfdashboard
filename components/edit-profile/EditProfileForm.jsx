"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useBackend } from "@/context/BackContext";

const EditProfileForm = () => {
  const { user, updateProfile, uploadImage } = useBackend();
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("/default-avatar.png");
  const [avatarFile, setAvatarFile] = useState(null);

  // Saat user berubah, set field form sesuai data user
  useEffect(() => {
    if (user) {
      setNickname(user.nickname || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setAvatar(user.photo || "/default-avatar.png");
    }
  }, [user]);

  // Handle perubahan avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const newAvatar = URL.createObjectURL(file);
      setAvatar(newAvatar);
    }
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    let photoUrl = avatar;

    if (avatarFile) {
      try {
        // Upload avatar menggunakan fungsi uploadImage dari context
        photoUrl = await uploadImage(avatarFile);
      } catch (error) {
        console.error("Gagal mengupload avatar:", error);
        alert("Gagal mengupload avatar.");
        return;
      }
    }

    const updatedUser = {
      ...user,
      nickname,
      phone,
      address,
      photo: photoUrl,
    };

    try {
      await updateProfile(updatedUser);
      alert("Profil berhasil diperbarui!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Terjadi kesalahan saat memperbarui profil.");
    }
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
              objectFit="cover"
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
        <label className="block mb-1 font-semibold text-main">
          Nickname
        </label>
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
        <label className="block mb-1 font-semibold text-main">
          Nomor HP
        </label>
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
        <label className="block mb-1 font-semibold text-main">
          Alamat
        </label>
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
