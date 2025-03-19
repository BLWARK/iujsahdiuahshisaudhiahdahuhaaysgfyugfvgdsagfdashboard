"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlineEdit, AiOutlineClose } from "react-icons/ai";
import { useBackend } from "@/context/BackContext";

const EditProfileForm = () => {
  const { user, updateProfile, uploadImage } = useBackend();
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("/default.jpg");
  const [avatarFile, setAvatarFile] = useState(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  // Saat user berubah, set field form sesuai data user
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setAvatar(user.avatar || "/default.jpg");
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
    let avatarUrl = avatar;

    if (avatarFile) {
      try {
        avatarUrl = await uploadImage(avatarFile);
      } catch (error) {
        console.error("Gagal mengupload avatar:", error);
        alert("Gagal mengupload avatar.");
        return;
      }
    }

    const updatedUser = {
      ...user,
      username, // Gunakan nilai dari field username (baru jika diedit)
      phone,
      address,
      avatar: avatarUrl,
    };

    try {
      await updateProfile(updatedUser);
      alert("Profil berhasil diperbarui!");
      setIsEditingUsername(false); // Nonaktifkan mode edit setelah berhasil
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

      {/* Username */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <label className="font-semibold text-main whitespace-nowrap">
            Username
          </label>
          {isEditingUsername ? (
            <button
              type="button"
              onClick={() => setIsEditingUsername(false)}
              title="Batal Edit"
              className="text-red-500"
            >
              
              <AiOutlineClose size={20} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingUsername(true)}
              title="Edit Username"
              className="text-blue-500 flex justify-center items-center gap-2 underline"
            >
             
              <AiOutlineEdit size={20} />
              Edit
            </button>
          )}
        </div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Masukkan Username"
          className={`w-full p-2 border rounded-md ${
            isEditingUsername
              ? ""
              : "bg-gray-100 cursor-not-allowed text-gray-400"
          }`}
          disabled={!isEditingUsername}
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
