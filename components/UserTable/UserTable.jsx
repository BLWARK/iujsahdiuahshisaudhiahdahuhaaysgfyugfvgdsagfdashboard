"use client";
import React, { useState } from "react";
import RoleSelector from "@/components/RoleSelector";

const UserTable = ({
  users = [],
  loggedInUserId,
  loggedInUserRole,
  onDelete,
  onChangeRole,
  onSuspend,
  onSave,
}) => {
  const roleHierarchy = ["Master", "Super Admin", "Editor", "Contributor"];
  const [hasChanges, setHasChanges] = useState(false);

  // ✅ Filter user yang memiliki role di bawah login user
  const filteredUsers = users.filter(
    (user) =>
      user.user_id !== loggedInUserId &&
      roleHierarchy.indexOf(user.role) > roleHierarchy.indexOf(loggedInUserRole)
  );

  const handleRoleChange = (userId, newRole) => {
    onChangeRole(userId, newRole);
    setHasChanges(true);
  };

  const handleSuspend = (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    onSuspend(userId, newStatus);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave();
    setHasChanges(false);
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr>
            <th className="border-b p-3">#</th>
            <th className="border-b p-3">Nama</th>
            <th className="border-b p-3">Email</th>
            <th className="border-b p-3">Role</th>
            <th className="border-b p-3">Status</th>
            <th className="border-b p-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user.user_id} className="hover:bg-gray-50">
              <td className="border-b p-3">{index + 1}</td>
              <td className="border-b p-3">{user.fullname || "-"}</td>
              <td className="border-b p-3">{user.email}</td>
              <td className="border-b p-3">
                <RoleSelector
                  currentRole={user.role}
                  loggedInUserRole={loggedInUserRole}
                  onChangeRole={(newRole) => handleRoleChange(user.user_id, newRole)}
                />
              </td>
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
                  onClick={() => handleSuspend(user.user_id, user.status)}
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

      <div className="mt-4 flex justify-end">
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
      </div>
    </div>
  );
};

export default UserTable;
