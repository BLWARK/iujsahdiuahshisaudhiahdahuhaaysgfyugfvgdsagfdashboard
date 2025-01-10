"use client";
import React, { useState, useEffect } from "react";
import UserTable from "@/components/UserTable/UserTable";
import PendingUsersTable from "@/components/UserTable/PendingUserTable";
import users from "@/data/users";
import pendingUsersData from "@/data/pendingUsers";

const ManageUsers = () => {
  const [userList, setUserList] = useState(users);
  const [pendingUsers, setPendingUsers] = useState(pendingUsersData);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      setLoggedInUser(storedUser);
    }
  }, []);

  const handleDeleteUser = (userId) => {
    setUserList(userList.filter((user) => user.id !== userId));
  };

  const handleChangeRole = (userId, newRole) => {
    setUserList(
      userList.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const handleSuspendUser = (userId, newStatus) => {
  setUserList(
    userList.map((user) =>
      user.id === userId ? { ...user, status: newStatus } : user
    )
  );
};


  const handleApproveUser = (userId) => {
    const approvedUser = pendingUsers.find((user) => user.id === userId);
    if (approvedUser) {
      setPendingUsers(pendingUsers.filter((user) => user.id !== userId));
      setUserList([
        ...userList,
        { ...approvedUser, role: "Contributor", status: "Active" },
      ]);
    }
  };

  const handleSaveChanges = () => {
    console.log("Perubahan telah disimpan:", userList);
    // Anda bisa menambahkan logika untuk menyimpan data ke backend di sini
  };
  

  const handleRejectUser = (userId, reason) => {
    setPendingUsers(pendingUsers.filter((user) => user.id !== userId));
    console.log(`User ID ${userId} ditolak dengan alasan: ${reason}`);
  };

  if (!loggedInUser) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Kelola Pengguna</h1>
      <UserTable
        users={userList}
        loggedInUserId={loggedInUser.id}
        loggedInUserRole={loggedInUser.role}
        onDelete={handleDeleteUser}
        onChangeRole={handleChangeRole}
        onSuspend={handleSuspendUser} // Pastikan onSuspend diteruskan
        onSave={handleSaveChanges}
      />

      <h1 className="text-2xl font-bold">Pending Users</h1>
      <PendingUsersTable
        pendingUsers={pendingUsers}
        onApprove={handleApproveUser}
        onReject={handleRejectUser}
      />
    </div>
  );
};

export default ManageUsers;
