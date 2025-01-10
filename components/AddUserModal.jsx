import React, { useState } from "react";

const AddUserModal = ({ onClose, onAddUser, userRole }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  // Role yang dapat diakses oleh pengguna berdasarkan role mereka
  const accessibleRoles = {
    Master: ["Super Admin", "Editor", "Contributor"],
    "Super Admin": ["Editor", "Contributor"],
    Editor: ["Contributor"],
  };

  // Filter role berdasarkan role pengguna yang login
  const roles = accessibleRoles[userRole] || [];

  const handleAdd = () => {
    if (name && email && role) {
      onAddUser({ name, email, role, status: "Active" });
      onClose();
    } else {
      alert("Nama, Email, dan Role wajib diisi.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-1/3">
        <h3 className="text-lg font-bold mb-4">Tambah Pengguna Baru</h3>
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Nama:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block font-medium">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block font-medium">Role:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="" disabled>
                Pilih Role
              </option>
              {roles.map((roleOption) => (
                <option key={roleOption} value={roleOption}>
                  {roleOption}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-4 gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
