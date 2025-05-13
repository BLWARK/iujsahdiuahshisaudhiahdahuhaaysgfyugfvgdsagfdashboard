"use client";
import React, { useEffect, useState } from "react";
import { useBackend } from "@/context/BackContext";
import Swal from "sweetalert2";

const PlatformAccessModal = ({ userId, isOpen, onClose }) => {
  const {
    getAllPlatforms,
    getPlatformAccessByUser,
    addPlatformAccess,
  } = useBackend();

  const [platforms, setPlatforms] = useState([]);
  const [selected, setSelected] = useState([]);
  const [owned, setOwned] = useState([]); // 🆕 Untuk membedakan
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Fetch platform list dan akses user saat modal dibuka
  useEffect(() => {
    const fetch = async () => {
      const allPlatforms = await getAllPlatforms();
      setPlatforms(allPlatforms);

      const access = await getPlatformAccessByUser(userId);
      const ownedPlatformIds = access.map((item) => item.platform_id);
      setSelected(ownedPlatformIds); // tandai sebagai terpilih
      setOwned(ownedPlatformIds);    // simpan yang dimiliki
    };

    if (isOpen) {
      fetch();
    }
  }, [isOpen, userId]);

  const togglePlatform = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const newAccess = selected.filter((pid) => !owned.includes(pid));

      if (newAccess.length === 0) {
        Swal.fire("ℹ️ Tidak Ada Perubahan", "Tidak ada akses baru yang ditambahkan.", "info");
        onClose();
        return;
      }

      for (const platformId of newAccess) {
        await addPlatformAccess(userId, platformId);
      }

      Swal.fire("✅ Sukses", "Akses platform ditambahkan", "success");
      onClose();
    } catch (err) {
      console.error("❌ Gagal menambahkan akses:", err);
      Swal.fire("❌ Error", "Gagal menambahkan akses platform", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md shadow">
        <h2 className="text-lg font-bold mb-4">Pilih Akses Platform</h2>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {platforms.map((plat, index) => (
            <label key={`${plat.platform_id}-${index}`} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={plat.platform_id}
                checked={selected.includes(plat.platform_id)}
                onChange={() => togglePlatform(plat.platform_id)}
              />
              {plat.platform_desc || plat.platform_name}
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlatformAccessModal;
