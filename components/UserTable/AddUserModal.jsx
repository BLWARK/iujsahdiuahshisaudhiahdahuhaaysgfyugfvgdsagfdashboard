"use client";
import React, { useState, useEffect } from "react";
import { useBackend } from "@/context/BackContext";
import Swal from "sweetalert2";

const AddUserModal = ({ isOpen, onClose, onSubmit }) => {
  const { uploadImage, addPlatformAccess, getAllPlatforms } = useBackend();

  const initialForm = {
    email: "",
    username: "", // ✅ tambahkan ini
    password: "",
    status: "active",
    fullname: "",
    role: "Contributor",
    avatar: "",
    selectedPlatforms: [],
  };

  const [formData, setFormData] = useState(initialForm);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [platformOptions, setPlatformOptions] = useState([]);

  useEffect(() => {
    const fetchPlatforms = async () => {
      const platforms = await getAllPlatforms();
      setPlatformOptions(platforms || []);
    };

    if (isOpen) {
      setFormData(initialForm);
      setAvatarFile(null);
      fetchPlatforms();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePlatform = (id) => {
    setFormData((prev) => {
      const already = prev.selectedPlatforms.includes(id);
      return {
        ...prev,
        selectedPlatforms: already
          ? prev.selectedPlatforms.filter((pid) => pid !== id)
          : [...prev.selectedPlatforms, id],
      };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
  };

  const handleSubmit = async () => {
    const { email, password, selectedPlatforms, ...userFields } = formData;

    if (!email || !password) {
      Swal.fire("❗Oops", "Email dan password wajib diisi!", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      let avatarUrl = "";

      if (avatarFile) {
        avatarUrl = await uploadImage(avatarFile);
      }

      const userPayload = {
        ...userFields,
        username: formData.username, // ✅ ambil dari formData.username
        email,
        password,
        avatar: avatarUrl,
        platform_ids: selectedPlatforms,
      };

      await onSubmit(userPayload); // ⬅️ kirim ke handleAddUser di ManageUsers
      Swal.fire("✅ Sukses", "Pengguna berhasil ditambahkan", "success");
      onClose();
    } catch (error) {
      Swal.fire(
        "❌ Gagal",
        error.message || "Gagal menambahkan pengguna",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Tambah Pengguna Baru</h2>

        <div className="grid grid-cols-1 gap-4">
          <input
            name="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            name="username"
            placeholder="Username"
            className="border p-2 rounded"
            value={formData.username}
            onChange={handleChange}
          />
           <input
            name="fullname"
            placeholder="fullname"
            className="border p-2 rounded"
            value={formData.fullname}
            onChange={handleChange}
          />

         
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 rounded"
          />
          <select
            name="role"
            className="border p-2 rounded"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="Contributor">Contributor</option>
            <option value="Editor">Editor</option>
          </select>

          {/* Platform checklist */}
          <div className="border p-2 rounded max-h-40 overflow-y-auto">
            <label className="font-semibold mb-1 block">Akses Platform:</label>
            {platformOptions.map((p) => (
              <label
                key={p.platform_id}
                className="flex items-center space-x-2 my-1"
              >
                <input
                  type="checkbox"
                  value={p.platform_id}
                  checked={formData.selectedPlatforms.includes(p.platform_id)}
                  onChange={() => togglePlatform(p.platform_id)}
                />
                <span>{p.platform_desc || p.platform_name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
