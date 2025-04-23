"use client";
import React, { useState } from "react";
import { FaEdit } from "react-icons/fa"; // alternatif lain

import EditUserModal from "@/components/UserTable/EditUserModal"; // 🆕 Modal edit user
import { useBackend } from "@/context/BackContext";
import Swal from "sweetalert2";

const UserTable = ({
  users = [],
  loggedInUserId,
  loggedInUserRole,
  onDelete,
  onSuspend,
  onUpdateUser,
}) => {
  const roleHierarchy = ["Master", "Super Admin", "Editor", "Contributor"];
  const { getUserById, updateUsers } = useBackend();
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedUserToEdit, setSelectedUserToEdit] = useState(null); // 🆕

  const filteredUsers = users.filter(
    (user) =>
      user.user_id !== loggedInUserId &&
      roleHierarchy.indexOf(user.role) > roleHierarchy.indexOf(loggedInUserRole)
  );

  const handleSuspend = async (userId, currentStatus, username) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";

    if (newStatus === "suspended") {
      const confirm = await Swal.fire({
        title: `Yakin ingin suspend user (${username})?`,
        html: `<p style="color:red;font-size:0.9rem;margin-top:4px;">User yang disuspend tidak akan bisa lagi mengakses akun mereka sebelum diaktifkan kembali.</p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, suspend",
        cancelButtonText: "Batal",
        confirmButtonColor: "#e3342f",
        cancelButtonColor: "#6c757d",
      });

      if (!confirm.isConfirmed) return;
    }

    try {
      await updateUsers({ user_id: userId, status: newStatus });
      onSuspend(userId, newStatus);

      Swal.fire(
        "✅ Berhasil",
        `Status user diubah menjadi ${newStatus}`,
        "success"
      );
    } catch (err) {
      Swal.fire("❌ Gagal", "Tidak bisa update status user", "error");
    }
  };

  const handleEditClick = async (userId) => {
    try {
      const userDetail = await getUserById(userId);

      if (userDetail?.user_id) {
        setSelectedUserToEdit(userDetail); // ini sudah cukup
      } else {
        Swal.fire("Tidak ditemukan", "User tidak valid", "error");
      }
    } catch (error) {
      Swal.fire("❌ Error", "Gagal mengambil data user", "error");
    }
  };

  // const handleSave = () => {
  //   onSave();
  //   setHasChanges(false);
  // };

  return (
    <div className="bg-white p-6 rounded-md shadow-md w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr>
            <th className="border-b p-3">Edit</th>
            <th className="border-b p-3">Nama</th>
            <th className="border-b p-3">Email</th>
            <th className="border-b p-3">Role</th>
            <th className="border-b p-3">Status</th>
            <th className="border-b p-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.user_id} className="hover:bg-gray-50">
              <td className="border-b p-3">
                <button
                  className="text-gray-600 hover:text-blue-600"
                  onClick={() => handleEditClick(user.user_id)}
                >
                  <FaEdit size={16} className="text-orange-400" />
                </button>
              </td>
              <td className="border-b p-3">{user.username || "-"}</td>
              <td className="border-b p-3">{user.email}</td>
              <td className="border-b p-3 capitalize">{user.role}</td>

              <td className="border-b p-3">
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    user.status === "active"
                      ? "bg-green-200 text-green-700"
                      : "bg-yellow-200 text-yellow-700"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="border-b p-3 space-x-2">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() =>
                    handleSuspend(user.user_id, user.status, user.username)
                  }
                >
                  {user.status === "active" ? "Suspend" : "Activate"}
                </button>

                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => onDelete(user.user_id)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* <div className="mt-4 flex justify-end">
        <button
          onClick={handleSave}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            hasChanges
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!hasChanges}
        >
          Simpan Perubahan
        </button>
      </div> */}

      {/* Modal edit user */}
      {selectedUserToEdit && (
        <EditUserModal
        isOpen={true}
        userData={selectedUserToEdit}
        onClose={() => setSelectedUserToEdit(null)}
        onUpdate={onUpdateUser} // ✅ kirim callback
      />
      
      )}
    </div>
  );
};

export default UserTable;
