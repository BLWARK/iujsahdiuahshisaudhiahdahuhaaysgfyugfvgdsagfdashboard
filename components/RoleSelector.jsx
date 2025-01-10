import React from "react";

const RoleSelector = ({ currentRole, loggedInUserRole, onChangeRole }) => {
  // Role yang dapat diakses sesuai role user yang login
  const accessibleRoles = {
    Master: ["Super Admin", "Editor", "Contributor"],
    "Super Admin": ["Editor", "Contributor"],
    Editor: ["Contributor"],
  };

  // Daftar role yang tersedia untuk user yang login
  const availableRoles = accessibleRoles[loggedInUserRole] || [];

  return (
    <select
      value={currentRole} // Nilai awal sesuai dengan data user.role
      onChange={(e) => onChangeRole(e.target.value)}
      className="border rounded-md p-2"
    >
      {/* Tampilkan role awal di atas jika ada */}
      <option value={currentRole} disabled>
        {currentRole}
      </option>

      {/* Render role yang dapat dipilih */}
      {availableRoles.map((role) => (
        role !== currentRole && ( // Hindari duplikasi role
          <option key={role} value={role}>
            {role}
          </option>
        )
      ))}
    </select>
  );
};

export default RoleSelector;
