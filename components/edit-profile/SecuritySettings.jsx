import { useState } from "react";
import { useBackend } from "@/context/BackContext";
import { useRouter } from "next/navigation";

const SecuritySettings = () => {
  const { changePassword } = useBackend();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Password baru tidak cocok!");
      return;
    }

    try {
      await changePassword(currentPassword, newPassword, router, setError); // ✅ Kirim setError ke context
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">🔒 Ubah Password</h2>

      {/* Tampilkan pesan error */}
      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      <div>
        <label>Password Lama</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label>Password Baru</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label>Konfirmasi Password Baru</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Simpan Password
      </button>
    </form>
  );
};

export default SecuritySettings;
