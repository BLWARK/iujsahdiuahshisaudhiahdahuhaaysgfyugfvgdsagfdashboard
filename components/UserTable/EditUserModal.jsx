"use client";
import React, { useEffect, useState } from "react";
import { useBackend } from "@/context/BackContext";
import Swal from "sweetalert2";

const EditUserModal = ({ isOpen, userData, onClose, onUpdate }) => {
  const {
    updateUsers,
    getAllPlatforms,
    getUserById, // gunakan endpoint ini untuk ambil user + platform_ids
  } = useBackend();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    role: "Contributor",
    username: "",
    status: "active",
    first_name: "",
    last_name: "",
    avatar: "",
  });

  const [platforms, setPlatforms] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const allowedRoles = ["Editor", "Contributor"];

  useEffect(() => {
    const fetchPlatforms = async () => {
      const allPlatforms = await getAllPlatforms();
      setPlatforms(allPlatforms);
    };

    if (isOpen && userData?.user_id) {
      fetchPlatforms();

      // langsung gunakan data dari props
      setForm({
        fullname: userData.fullname || "",
        email: userData.email || "",
        role: userData.role || "Contributor",
        username: userData.username || "",
        status: userData.status || "active",
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        avatar: userData.avatar || "",
      });

      setSelectedPlatforms(
        (userData.platform_access || []).map((p) => Number(p.platform_id))
      );
      // ⬅️ gunakan dari props langsung
    }
  }, [isOpen, userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const togglePlatform = (platformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSubmit = async () => {
    try {
      await updateUsers({
        ...form,
        user_id: userData.user_id,
        platform_ids: selectedPlatforms, // ⬅️ kirim sebagai array platform
      });
      
      if (onUpdate) {
        onUpdate({ ...userData, ...form }); // ✅ panggil callback dengan user baru
      }

      Swal.fire("✅ Sukses", "Data pengguna berhasil diperbarui", "success");
      onClose();
    } catch (err) {
      console.error("❌ Error update:", err);
      Swal.fire("❌ Gagal", "Tidak bisa update user", "error");
    }
  };

  if (!isOpen || !userData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Edit Pengguna</h2>
        <p className="mb-2 text-gray-500">Nama</p>
        <input
        
          name="fullname"
          placeholder="Full Name"
          className="border p-2 mb-6 w-full rounded "
          value={form.fullname}
          onChange={handleChange}
        />
        <p className="mb-2">Email</p>
        <input
          name="email"
          placeholder="Email"
          className="border p-2 mb-6 w-full rounded"
          value={form.email}
          onChange={handleChange}
        />
         <p className="mb-2">Role</p>
        <select
          name="role"
          className="border p-2 mb-6 w-full rounded"
          value={form.role}
          onChange={handleChange}
        >
          {allowedRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <div className="mb-4">
  <p className="mb-1 font-medium">Akses Platform:</p>
  <div className="grid grid-row-2 gap-2 max-h-32 overflow-y-auto mb-2">
    {platforms.map((p) => (
      <label key={p.platform_id} className="flex items-center gap-2">
        <input
          type="checkbox"
          value={p.platform_id}
          checked={selectedPlatforms.includes(Number(p.platform_id))}
          onChange={() => togglePlatform(Number(p.platform_id))}
        />
        {p.platform_desc || p.platform_name}
      </label>
    ))}
  </div>

  {/* 🔴 Tombol hapus semua akses */}
  <div className="text-left">
    <button
      type="button"
      onClick={async () => {
        const confirm = await Swal.fire({
          title: "Hapus Semua Akses?",
          text: "Akses platform pengguna ini akan dikosongkan.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Ya, hapus semua",
          cancelButtonText: "Batal",
        });

        if (confirm.isConfirmed) {
          setSelectedPlatforms([]);
        }
      }}
      className="text-sm text-white bg-red-500 p-2 rounded-lg hover:bg-red-700 mt-2"
    >
    Hapus semua akses
    </button>
  </div>
</div>


        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
