import { useState } from "react";
import { useBackend } from "@/context/BackContext";
import { useRouter } from "next/navigation";
import NotifHeadEditor from "@/components/NotifHeadEditor";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // ✅ Import icon

const SecuritySettings = () => {
  const { changePassword } = useBackend();
  const router = useRouter();

  // ✅ State untuk input password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✅ State untuk menampilkan password
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ State untuk notifikasi
  const [notification, setNotification] = useState(null);

  // ✅ Fungsi Validasi Password (Minimal 8 karakter, simbol, angka)
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!passwordRegex.test(password)) {
      setNotification({
        type: "error",
        message:
          "❌ Password harus memiliki minimal 8 karakter, termasuk huruf besar, huruf kecil, angka, dan simbol.",
      });
      return false;
    }
    return true;
  };

  // ✅ Handle submit password
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setNotification({
        type: "error",
        message: "❌ Password baru tidak cocok!",
      });
      return;
    }

    if (!validatePassword(newPassword)) {
      return;
    }

    try {
      await changePassword(
        currentPassword,
        newPassword,
        router,
        (error) => {
          if (error) {
            setNotification({
              type: "error",
              message: error,
            });
          }
        },
        setNotification
      );
    } catch (error) {
      console.error("❌ Error changing password:", error);
      setNotification({
        type: "error",
        message: "❌ Terjadi kesalahan saat mengubah password.",
      });
    }
  };

  // ✅ Fungsi untuk menutup popup notifikasi
  const handleCloseNotification = () => {
    setNotification(null);
    if (notification?.type === "success") {
      router.push("/login");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">🔒 Ubah Password</h2>

      {/* ✅ Password Lama */}
      <div className="relative">
        <label>Password Lama</label>
        <input
          type={showCurrentPassword ? "text" : "password"}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
        {/* ✅ Tombol Toggle Password */}
        <button
          type="button"
          className="absolute right-3 top-9 text-gray-500"
          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
        >
          {showCurrentPassword ? (
            <AiOutlineEyeInvisible size={20} />
          ) : (
            <AiOutlineEye size={20} />
          )}
        </button>
      </div>

      {/* ✅ Password Baru */}
      <div className="relative">
        <label>Password Baru</label>
        <input
          type={showNewPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
        {/* ✅ Tombol Toggle Password */}
        <button
          type="button"
          className="absolute right-3 top-9 text-gray-500"
          onClick={() => setShowNewPassword(!showNewPassword)}
        >
          {showNewPassword ? (
            <AiOutlineEyeInvisible size={20} />
          ) : (
            <AiOutlineEye size={20} />
          )}
        </button>
      </div>

      {/* ✅ Konfirmasi Password Baru */}
      <div className="relative">
        <label>Konfirmasi Password Baru</label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
        {/* ✅ Tombol Toggle Password */}
        <button
          type="button"
          className="absolute right-3 top-9 text-gray-500"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? (
            <AiOutlineEyeInvisible size={20} />
          ) : (
            <AiOutlineEye size={20} />
          )}
        </button>
      </div>

      {/* ✅ Tombol Simpan */}
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
      >
        Simpan Password
      </button>

      {/* ✅ Komponen Notifikasi */}
      {notification?.message && (
        <NotifHeadEditor
          type={notification.type}
          message={notification.message}
          onClose={handleCloseNotification}
        />
      )}
    </form>
  );
};

export default SecuritySettings;
