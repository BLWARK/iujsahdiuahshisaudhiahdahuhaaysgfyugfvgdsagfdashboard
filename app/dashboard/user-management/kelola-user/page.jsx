"use client";
import React, { useState, useEffect } from "react";
import UserTable from "@/components/UserTable/UserTable";
import PendingUsersTable from "@/components/UserTable/PendingUserTable";
import AddUserModal from "@/components/UserTable/AddUserModal";
import Swal from "sweetalert2";
import { useBackend } from "@/context/BackContext";

const ManageUsers = () => {
  const { getAllUsers, createUser,  deleteUserById } = useBackend();

  const [userList, setUserList] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      setLoggedInUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const all = await getAllUsers();
      const active = all.filter((u) => u.status !== "Pending");
      const pending = all.filter((u) => u.status === "Pending");
      setUserList(active);
      setPendingUsers(pending);
    };

    fetchUsers();
  }, [getAllUsers]);

  const handleChangeRole = (userId, newRole) => {
    setUserList(
      userList.map((user) =>
        user.user_id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const handleSuspendUser = (userId, newStatus) => {
    setUserList(
      userList.map((user) =>
        user.user_id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  const handleApproveUser = (userId) => {
    const approvedUser = pendingUsers.find((user) => user.user_id === userId);
    if (approvedUser) {
      setPendingUsers(pendingUsers.filter((user) => user.user_id !== userId));
      setUserList([
        ...userList,
        { ...approvedUser, role: "Contributor", status: "Active" },
      ]);
    }
  };

  const handleRejectUser = (userId, reason) => {
    setPendingUsers(pendingUsers.filter((user) => user.user_id !== userId));
    console.log(`User ID ${userId} ditolak karena: ${reason}`);
  };

  const handleSaveChanges = () => {
    console.log("📤 Simpan perubahan ke backend (dummy):", userList);
  };

  const handleAddUser = async (userData) => {
    try {
      await createUser(userData);
  
      const all = await getAllUsers();
      const active = all.filter((u) => u.status !== "Pending");
      const pending = all.filter((u) => u.status === "Pending");
      setUserList(active);
      setPendingUsers(pending);
      setIsModalOpen(false);
  
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "User berhasil ditambahkan.",
        confirmButtonColor: "#3085d6",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menambahkan user.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus user ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });
  
    if (result.isConfirmed) {
      try {
        await deleteUserById(userId);
        const updated = await getAllUsers();
        const active = updated.filter((u) => u.status !== "Pending");
        const pending = updated.filter((u) => u.status === "Pending");
        setUserList(active);
        setPendingUsers(pending);
  
        Swal.fire("✅ Dihapus!", "User berhasil dihapus.", "success");
      } catch (err) {
        Swal.fire("❌ Gagal", "Tidak dapat menghapus user.", "error");
      }
    }
  };
  

  if (!loggedInUser) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-8">
      <div className="kelola-tambah-user flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kelola Pengguna</h1>
        <button
          className="p-3 bg-blue-500 text-white  hover:bg-blue-600 rounded-lg"
          onClick={() => setIsModalOpen(true)}
        >
          + Tambah user
        </button>
      </div>

      <UserTable
        users={userList}
        loggedInUserId={loggedInUser.user_id}
        loggedInUserRole={loggedInUser.role}
        onDelete={handleDeleteUser}
        onChangeRole={handleChangeRole}
        onSuspend={handleSuspendUser}
        onSave={handleSaveChanges}
      />

      <h1 className="text-2xl font-bold">Pending Users</h1>
      <PendingUsersTable
        pendingUsers={pendingUsers}
        onApprove={handleApproveUser}
        onReject={handleRejectUser}
      />

      {/* ✅ Modal Tambah User */}
      {isModalOpen && (
        <AddUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddUser}
        />
      )}
    </div>
  );
};

export default ManageUsers;
