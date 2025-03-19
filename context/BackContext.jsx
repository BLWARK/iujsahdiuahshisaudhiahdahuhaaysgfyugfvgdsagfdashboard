"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { customPost, customGet, customPut } from "../hooks/customAxios";

export const BackContext = createContext();

export const BackProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("Guest");
  const [token, setToken] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [isSuccessPopup, setSuccessPopup] = useState(false); // ✅ State untuk kontrol popup sukses

  const [articleData, setArticleData] = useState({
    platform_id: null,
    title: "",
    meta_title: "",
    slug: "",
    type: "",
    description: "",
    category: [],
    tags: "",
    image: "",
    image_alt: "",
    image_title: "",
    caption: "",
    scheduled_at: 0,
    author_id: null,
    approved_by: 0,
    content: "",
  });

  const router = useRouter();

  // ✅ Fungsi untuk mengecek apakah sesi masih berlaku
  const isSessionValid = () => {
    const expiresAt = localStorage.getItem("expiresAt");
    return expiresAt && new Date().getTime() < Number(expiresAt);
  };

  // ✅ Load data dari localStorage saat pertama kali aplikasi berjalan
  useEffect(() => {
    if (typeof window === "undefined") return; // Pastikan berjalan di client-side

    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const storedToken = localStorage.getItem("token");
    const storedPlatforms = JSON.parse(
      localStorage.getItem("platforms") || "[]"
    );
    const storedPortal = JSON.parse(
      localStorage.getItem("selectedPortal") || "null"
    );

    // ✅ Jika sesi sudah kedaluwarsa, otomatis logout
    if (!isSessionValid()) {
      console.warn("⚠️ Sesi telah kedaluwarsa, logout otomatis...");
      logout();
      return;
    }

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
      setRole(storedUser.role || "Guest");
      setPlatforms(storedPlatforms);

      const platformId =
        storedPortal?.platform_id || storedPlatforms?.[0]?.platform_id || null;
      if (platformId) {
        console.log("🔄 Memuat artikel berdasarkan platform_id:", platformId);
        setSelectedPortal(storedPortal || storedPlatforms[0]); // Simpan portal yang dipilih
        getArticles(platformId); // Ambil artikel berdasarkan platform_id
      } else {
        console.warn(
          "⚠️ Tidak ada portal yang dipilih, redirect ke /select-portal"
        );
        router.push("/select-portal"); // Redirect jika portal belum dipilih
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  // ✅ Fungsi untuk mengambil artikel berdasarkan platform_id
  const getArticles = async (platformId) => {
    if (!platformId) {
      console.warn("⚠️ getArticles() dipanggil tanpa platformId");
      return;
    }
    try {
      console.log(
        "📡 Mengambil artikel dari API untuk platform_id:",
        platformId
      );
      const response = await customGet(
        `/api/articles?platform_id=${platformId}`
      );
      setArticles(response.data); // Simpan artikel dari backend
    } catch (error) {
      console.error("❌ Error fetching articles:", error);
    }
  };

  const getDraftArticles = async () => {
    if (!selectedPortal?.platform_id || !user?.user_id) {
     
      return;
    }

    try {
      const response = await customGet(
        `/api/articles?status=draft&platform_id=${selectedPortal.platform_id}&user_id=${user.user_id}`
      );
      setArticles(response.data); // Simpan artikel dari backend
    } catch (error) {
      console.error("❌ Error fetching draft articles:", error);
    }
  };
  

  // ✅ Update selected platform dan simpan di localStorage
  const updatePlatform = (platform) => {
    if (!platform) return;

    console.log("✅ Portal dipilih:", platform);
    localStorage.setItem("selectedPortal", JSON.stringify(platform));
    setSelectedPortal(platform);

    if (platform.platform_id) {
      getArticles(platform.platform_id); // 🔥 Langsung panggil API setelah pilih portal
    }
  };

  // // ✅ Hapus token hanya jika browser ditutup
  // useEffect(() => {
  //   const handleUnload = () => {
  //     localStorage.removeItem("token");
  //     localStorage.removeItem("user");
  //     localStorage.removeItem("platforms");
  //     setUser(null);
  //     setToken(null);
  //     setRole("Guest");
  //     setPlatforms([]);
  //   };

  //   window.addEventListener("beforeunload", handleUnload);
  //   return () => {
  //     window.removeEventListener("beforeunload", handleUnload);
  //   };
  // }, []);  

  // ✅ Fungsi untuk update state artikel
  const updateArticleData = (field, value) => {
    setArticleData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ Fungsi Login dengan sesi 8 jam
  const login = async (email, password) => {
    try {
      const response = await customPost("/api/login", { email, password });

      if (response.token) {
        const expiresAt = new Date().getTime() + 8 * 60 * 60 * 1000; // 🔥 8 jam dari sekarang

        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("platforms", JSON.stringify(response.platforms));
        localStorage.setItem("expiresAt", expiresAt.toString()); // ✅ Simpan waktu kedaluwarsa

        setToken(response.token);
        setUser(response.user);
        setRole(response.user.role || "Guest");
        setPlatforms(response.platforms);

        setArticleData((prev) => ({
          ...prev,
          author_id: response.user.user_id,
          platform_id: response.platforms?.[0]?.platform_id || null,
        }));

        router.push("/select-portal");
      }
    } catch (error) {
      console.error("❌ Login gagal:", error);
      alert("Login gagal! Periksa kembali email dan password.");
    }
  };

  // ✅ Fungsi untuk menyimpan draft artikel
  const saveDraft = async () => {
    try {
      console.log("💾 Menyimpan draft artikel:", articleData);
      await customPost("/api/articles", {
        ...articleData,
        status: "Draft",
      });
      alert("✅ Artikel berhasil disimpan sebagai draft!");
    } catch (error) {
      console.error("❌ Gagal menyimpan draft:", error);
      alert("Terjadi kesalahan saat menyimpan draft.");
    }
  };

  // ✅ Fungsi untuk submit artikel dengan upload gambar dan update
  const submitArticle = async () => {

    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const userId = user?.user_id || storedUser?.user_id || null;
    // Ambil platform_id dari selectedPortal, pastikan sudah valid
    const platformId = selectedPortal?.platform_id;
  
    if (!platformId || !userId) {
      alert("❗ Pastikan Anda telah memilih portal dan login sebelum mengirim artikel.");
      return;
    }
  
    // Pastikan platform_id adalah integer antara 0 dan 9
    const platformIdInt = parseInt(platformId, 10); // Ubah platform_id menjadi integer
    if (isNaN(platformIdInt) || platformIdInt < 0 || platformIdInt > 9) {
      alert("❌ Platform ID harus berupa angka valid antara 0 dan 9.");
      return;
    }
  
    const { imageFile, ...articleWithoutImage } = articleData || {}; // Pisahkan imageFile dari data artikel
  
    // Jika ada gambar, upload gambar terlebih dahulu
    let imageUrl = null;
    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile); // Upload gambar dan dapatkan URL
      } catch (error) {
        console.error("Gagal mengupload gambar:", error);
      }
    }
  
    try {
      const payload = {
        ...articleWithoutImage,
        author_id: userId,
        platform_id: platformIdInt, // Pastikan platform_id dikirim sebagai integer yang valid
        image: imageUrl || "", // Sertakan URL gambar jika ada
        status: "Pending",
      };
  
      const response = await customPost("/api/articles", payload);
  
      const articleId = response?.article_id || response?._id;
  
      if (!articleId) {
        throw new Error("Gagal mendapatkan article_id.");
      }
  
      console.log("✅ Artikel berhasil dikirim dengan ID:", articleId);
  
      return articleId;
    } catch (error) {
      console.error("Error submitting article:", error);
      throw new Error("Gagal mengirim artikel.");
    }
  };
  
  
  // Fungsi untuk upload gambar
  const uploadImage = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      
      const response = await customPost("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = response?.data?.url || response?.url || null;

      if (!imageUrl) {
        throw new Error("Gagal mendapatkan URL gambar.");
      }

      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Gagal upload gambar.");
    }
  };

  
  // Fungsi untuk approve artikel
  const approveArticle = async (articleId) => {
    try {
      const response = await customPut(`/api/articles/${articleId}`, {
        article_id: articleId,  // Kirimkan article_id ke backend
        status: "Publish", // Status yang ingin diubah
      });
  
      console.log("Response:", response); // Log response dari backend
  
      if (response?.article_id) {
        console.log(`Artikel dengan ID ${articleId} telah disetujui dan dipublikasikan.`);
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article.article_id === articleId
              ? { ...article, status: "Publish" }
              : article
          )
        );
      } else {
        throw new Error("Artikel gagal diperbarui.");
      }
    } catch (error) {
      console.error("❌ Gagal menyetujui artikel:", error);
      alert("Terjadi kesalahan saat menyetujui artikel.");
    }
  };


  // Tambahkan fungsi updateProfile
const updateProfile = async (updatedUser) => {
  try {
    const response = await customPut("/api/users", updatedUser);
    // Misal API mengembalikan data user yang sudah diperbarui
    const newProfile = response.data || response;
    setUser(newProfile);
    localStorage.setItem("currentUser", JSON.stringify(newProfile));
    return newProfile;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
  
  
  
  
  

  // ✅ Fungsi Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("platforms");
    setUser(null);
    setToken(null);
    setRole("Guest");
    setPlatforms([]);
    router.push("/login");
  };

  // ✅ Gunakan useMemo agar tidak re-render berlebihan
  const contextValue = useMemo(
    () => ({
      user,
      role,
      token,
      platforms,
      articleData,
      articles,
      selectedPortal,
      isSuccessPopup, // ✅ Tambahkan state popup ke context
      setSuccessPopup,
      submitArticle, // Fungsi submit artikel
      uploadImage, // Fungsi upload gambar
      getDraftArticles,
      setArticleData,
      updateArticleData,
      updatePlatform,
      saveDraft,
      getArticles,
      login,
      logout,
      approveArticle, // Menambahkan fungsi approveArticle
      updateProfile, // <-- fungsi updateProfile ditambahkan di sini
    }),
    [user, role, token, platforms, articleData, articles, selectedPortal, isSuccessPopup]
  );

  return (
    <BackContext.Provider value={contextValue}>{children}</BackContext.Provider>
  );
};

export function useBackend() {
  return useContext(BackContext);
}
