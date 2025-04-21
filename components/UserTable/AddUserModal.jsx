"use client";
import React, { useState, useEffect } from "react";
import { useBackend } from "@/context/BackContext";
import Swal from "sweetalert2";


const AddUserModal = ({ isOpen, onClose, onSubmit }) => {
  const { uploadImage } = useBackend();

  const initialForm = {
    email: "",
    password: "",
    status: "active",
    fullname: "",
    first_name: "",
    last_name: "",
    role: "Contributor",
    avatar: "", // Will be set by upload
  };

  const [formData, setFormData] = useState(initialForm);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
  };

  useEffect(() => {
    if (isOpen) {
      setFormData(initialForm);
      setAvatarFile(null);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    const { email, password } = formData;
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
  
      const { user_id, ...cleanForm } = formData;
  
      const userPayload = {
        ...cleanForm,
        username: email,
        avatar: avatarUrl,
      };
  
      console.log("📦 Payload:", userPayload);
  
      // anggap sukses jika tidak throw
      await onSubmit(userPayload);
  
      Swal.fire("✅ Sukses", "Pengguna berhasil ditambahkan", "success");
      onClose();
    } catch (error) {
      console.error("❌ Gagal:", error);
  
      if (error?.response?.data?.code === "23505") {
        Swal.fire("❌ Duplikat", "Email sudah terdaftar.", "error");
      } else {
        Swal.fire("❌ Error", "Gagal menambahkan pengguna.", "error");
      }
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
            name="fullname"
            placeholder="Full Name"
            className="border p-2 rounded"
            value={formData.fullname}
            onChange={handleChange}
          />
          <input
            name="first_name"
            placeholder="First Name"
            className="border p-2 rounded"
            value={formData.first_name}
            onChange={handleChange}
          />
          <input
            name="last_name"
            placeholder="Last Name"
            className="border p-2 rounded"
            value={formData.last_name}
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
            <option value="Super Admin">Super Admin</option>
          </select>
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
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
