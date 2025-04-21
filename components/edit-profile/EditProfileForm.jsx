"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlineEdit, AiOutlineClose } from "react-icons/ai";
import { useBackend } from "@/context/BackContext";
import NotifHeadEditor from "@/components/NotifHeadEditor"; // ✅ Import komponen notifikasi

const EditProfileForm = () => {
  const { user, updateProfile, uploadImage } = useBackend();

  // ✅ State untuk data user
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("/default.jpg");
  const [avatarFile, setAvatarFile] = useState(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  // ✅ State untuk notifikasi
  const [notification, setNotification] = useState(null);

  // ✅ Saat user berubah, set field form sesuai data user
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setAvatar(user.avatar || "/default.jpg");
    }
  }, [user]);

  // ✅ Handle perubahan avatar (TIDAK LANGSUNG UPLOAD)
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file); // ✅ Simpan file di state (BELUM di-upload)
      const newAvatar = URL.createObjectURL(file);
      setAvatar(newAvatar);
    }
  };

  // ✅ Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    let avatarUrl = avatar;

    // ✅ Upload gambar HANYA JIKA ADA FILE BARU
    if (avatarFile) {
      try {
        avatarUrl = await uploadImage(avatarFile); // ✅ Upload gambar
      } catch (error) {
        console.error("❌ Gagal mengupload avatar:", error);
        setNotification({
          type: "error",
          message: "❌ Gagal mengupload avatar!",
        });
        return;
      }
    }

    const updatedUser = {
      ...user,
      username,
      phone,
      address,
      avatar: avatarUrl,
    };

    try {
      await updateProfile(updatedUser);

      // ✅ Munculkan notifikasi sukses
      setNotification({
        type: "success",
        message: "✅ Profil berhasil diperbarui!",
      });

      // ✅ Nonaktifkan mode edit username
      setIsEditingUsername(false);
    } catch (error) {
      console.error("❌ Error updating profile:", error);

      // ✅ Munculkan notifikasi error
      setNotification({
        type: "error",
        message: "❌ Terjadi kesalahan saat memperbarui profil!",
      });
    }
  };

  // ✅ Fungsi untuk menutup popup notifikasi dan refresh halaman
  const handleCloseNotification = () => {
    setNotification(null);
     // ✅ Refresh halaman setelah menutup popup
  };

  if (!user) {
    return <p>Memuat data...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ✅ Avatar */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Ubah Avatar</h2>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 relative">
            <Image
              src={avatar}
              alt="Avatar"
              fill
              className="rounded-full border border-gray-300 object-cover"
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

      {/* ✅ Username */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <label className="font-semibold text-main whitespace-nowrap">
            Username
          </label>
          {isEditingUsername ? (
            <button
              type="button"
              onClick={() => setIsEditingUsername(false)}
              className="text-red-500"
            >
              <AiOutlineClose size={20} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingUsername(true)}
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
          disabled={!isEditingUsername}
          className={`w-full p-2 border rounded-md ${
            isEditingUsername
              ? ""
              : "bg-gray-100 cursor-not-allowed text-gray-400"
          }`}
        />
      </div>

      {/* ✅ Email */}
      <div>
        <label className="block mb-1 font-semibold text-main">Email</label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed text-gray-400"
        />
      </div>

      {/* ✅ Nomor HP */}
      <div>
        <label className="block mb-1 font-semibold text-main">Nomor HP</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* ✅ Alamat */}
      <div>
        <label className="block mb-1 font-semibold text-main">Alamat</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2 border rounded-md"
          rows="3"
        />
      </div>

      {/* ✅ Tombol Simpan */}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Simpan Perubahan
      </button>

      {/* ✅ Komponen Notifikasi */}
      {notification?.message && (
        <NotifHeadEditor
          type={notification.type}
          message={notification.message}
          onClose={handleCloseNotification}
        />
      )}
    </form>
  );
};

export default EditProfileForm;
