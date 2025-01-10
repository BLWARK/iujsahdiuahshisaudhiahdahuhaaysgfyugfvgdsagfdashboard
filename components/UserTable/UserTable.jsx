import React, { useState } from "react";
import RoleSelector from "@/components/RoleSelector";

const UserTable = ({
  users,
  loggedInUserId,
  loggedInUserRole,
  onDelete,
  onChangeRole,
  onSuspend,
  onSave,
}) => {
  const roleHierarchy = ["Master", "Super Admin", "Editor", "Contributor"];

  const filteredUsers = users.filter(
    (user) =>
      user.id !== loggedInUserId &&
      roleHierarchy.indexOf(user.role) > roleHierarchy.indexOf(loggedInUserRole)
  );

  const [hasChanges, setHasChanges] = useState(false);

  const handleRoleChange = (userId, newRole) => {
    onChangeRole(userId, newRole);
    setHasChanges(true);
  };

  const handleSuspend = (userId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
    onSuspend(userId, newStatus);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave();
    setHasChanges(false);
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <table className="w-full text-left border-collapse table-fixed">
        <colgroup>
          <col style={{ width: "5%" }} />
          <col style={{ width: "25%" }} />
          <col style={{ width: "25%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "15%" }} />
        </colgroup>
        <thead>
          <tr>
            <th className="border-b p-4">#</th>
            <th className="border-b p-4">Nama</th>
            <th className="border-b p-4">Email</th>
            <th className="border-b p-4">Role</th>
            <th className="border-b p-4">Status</th>
            <th className="border-b p-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="border-b p-4">{index + 1}</td>
              <td className="border-b p-4">{user.name}</td>
              <td className="border-b p-4">{user.email}</td>
              <td className="border-b p-4">
                <RoleSelector
                  currentRole={user.role}
                  loggedInUserRole={loggedInUserRole}
                  onChangeRole={(newRole) => handleRoleChange(user.id, newRole)}
                />
              </td>
              <td className="border-b p-4">
                <span
                  className={`px-2 py-1 rounded-md text-xs ${
                    user.status === "Active"
                      ? "bg-green-200 text-green-700"
                      : "bg-yellow-200 text-yellow-700"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="border-b p-4 py-10 mr-10 flex gap-2">
                <button
                  className="text-blue-500 hover:text-blue-700 transition-all"
                  onClick={() => handleSuspend(user.id, user.status)}
                >
                  {user.status === "Active" ? "Suspend" : "Activate"}
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => onDelete(user.id)}
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
