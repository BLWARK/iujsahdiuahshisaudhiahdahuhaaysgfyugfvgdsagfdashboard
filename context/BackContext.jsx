"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import {
  customPost,
  customGet,
  customPut,
  customDelete,
} from "../hooks/customAxios";

export const BackContext = createContext();

export const BackProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("Guest");
  const [token, setToken] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [isSuccessPopup, setSuccessPopup] = useState(false); // ✅ State untuk kontrol popup sukses
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [draftMeta, setDraftMeta] = useState({ totalItems: 0 });

  const [articleData, setArticleData] = useState({
    platform_id: null,
    title: "",
    meta_title: "",
    slug: "",
    type: "",
    description: "",
    category: [],
    tags: [],
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

  // ✅ Sinkronisasi dengan localStorage saat refresh atau perubahan state
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = JSON.parse(
      localStorage.getItem("currentUser") ||
        localStorage.getItem("user") ||
        "null"
    );
    const storedToken = localStorage.getItem("token");
    const storedPlatforms = JSON.parse(
      localStorage.getItem("platforms") || "[]"
    );
    const storedPortal = JSON.parse(
      localStorage.getItem("selectedPortal") || "null"
    );

    if (!isSessionValid()) {
      console.warn("⚠️ Sesi telah kedaluwarsa. Logout otomatis...");
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
        setSelectedPortal(storedPortal || storedPlatforms[0]);
      } else {
        console.warn("⚠️ Tidak ada portal yang dipilih. Redirect ke login...");
        router.push("/select-portal");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

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

      if (response?.user?.status === "suspended") {
        return {
          success: false,
          message: "Akun Anda disuspend. Silakan hubungi admin.",
        };
      }

      if (response?.token && response?.user) {
        const expiresAt = new Date().getTime() + 8 * 60 * 60 * 1000;

        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("currentUser", JSON.stringify(response.user));
        localStorage.setItem("platforms", JSON.stringify(response.platforms));
        localStorage.setItem("expiresAt", expiresAt.toString());

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

        return { success: true };
      }

      return {
        success: false,
        message: "Email atau password salah. Silakan coba lagi.",
      };
    } catch (error) {
      // ✅ Ambil pesan dari backend jika tersedia
      const msg = error?.response?.data?.message;

      if (msg === "Invalid credentials") {
        return {
          success: false,
          message: "Email atau password salah. Silakan coba lagi.",
        };
      }

      if (msg === "User is suspended") {
        return {
          success: false,
          message: "Akun Anda disuspend. Silakan hubungi admin.",
        };
      }
      if (msg === "Database error") {
        return {
          success: false,
          message: "Gagal Login Silahkan cek email dan password anda",
        };
      }

      // Fallback jika pesan tidak dikenal
      return {
        success: false,
        message: msg || "Login gagal. Silakan coba lagi nanti.",
      };
    }
  };

  // ✅ Fungsi untuk menyimpan draft artikel
  const saveDraft = async () => {
    try {
      const { imageFile, ...articleWithoutImage } = articleData;

      let imageUrl = null;
      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile);
        } catch (err) {
          console.error("❌ Gagal upload gambar:", err);
        }
      }

      const platformIdInt = parseInt(articleWithoutImage.platform_id, 10);
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      const userId = user?.user_id || storedUser?.user_id || null;

      if (!userId) {
        alert("❌ Gagal menyimpan draft: user tidak ditemukan.");
        return;
      }

      const payload = {
        ...articleWithoutImage,
        platform_id: platformIdInt,
        author_id: userId,
        image: imageUrl || articleData.image || "",
        status: "Draft",
        tags: Array.isArray(articleWithoutImage.tags)
          ? articleWithoutImage.tags.map((tag) =>
              tag.trim().toLowerCase().replace(/\s+/g, "-")
            )
          : typeof articleWithoutImage.tags === "string"
          ? articleWithoutImage.tags
              .split(",")
              .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, "-"))
          : [],
      };

      console.log("💾 Draft Payload:", payload);
      await customPost("/api/articles", payload);
      alert("✅ Artikel berhasil disimpan sebagai draft!");
    } catch (error) {
      console.error("❌ Gagal menyimpan draft:", error);
      alert("Terjadi kesalahan saat menyimpan draft.");
    }
  };

  const saveEditedDraft = async (articleId, articleData) => {
    try {
      const { imageFile, author, created_at, updated_at, ...rest } =
        articleData;
      let imageUrl = null;

      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile);
        } catch (error) {
          console.error("❌ Gagal upload gambar:", error);
        }
      }

      const payload = {
        ...rest,
        image: imageUrl || articleData.image || "",
        status: "Draft",
        tags: Array.isArray(rest.tags)
          ? rest.tags.map((tag) =>
              tag.trim().toLowerCase().replace(/\s+/g, "-")
            )
          : typeof rest.tags === "string"
          ? rest.tags
              .split(",")
              .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, "-"))
          : [],
      };

      const response = await customPut(`/api/articles/${articleId}`, payload);
      console.log("✅ Draft berhasil disimpan:", response);
      return response;
    } catch (error) {
      console.error("❌ Gagal menyimpan draft:", error);
      throw error;
    }
  };

  // ✅ Fungsi untuk submit artikel dengan upload gambar dan update
  const submitArticle = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const userId = user?.user_id || storedUser?.user_id || null;
    const platformId = selectedPortal?.platform_id;

    if (!platformId || !userId) {
      alert(
        "❗ Pastikan Anda telah memilih portal dan login sebelum mengirim artikel."
      );
      return;
    }

    const platformIdInt = parseInt(platformId, 10);
    if (!Number.isInteger(platformIdInt) || platformIdInt <= 0) {
      alert("❌ Platform ID tidak valid.");
      return;
    }

    const { imageFile, ...articleWithoutImage } = articleData || {};
    let imageUrl = null;

    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (error) {
        console.error("❌ Gagal mengupload gambar:", error);
        alert("❌ Upload gambar gagal. Silakan coba lagi.");
        return;
      }
    }

    try {
      const payload = {
        ...articleWithoutImage,
        author_id: userId,
        platform_id: platformIdInt,
        image: imageUrl || "",
        status: "Pending",
        description: articleWithoutImage.description || "",
        tags: Array.isArray(articleWithoutImage.tags)
          ? articleWithoutImage.tags.map((tag) =>
              tag.trim().toLowerCase().replace(/\s+/g, "-")
            )
          : typeof articleWithoutImage.tags === "string"
          ? articleWithoutImage.tags
              .split(",")
              .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, "-"))
          : [],
      };

      const response = await customPost("/api/articles", payload);
      const articleId = response?.article_id || response?._id;

      if (!articleId) {
        throw new Error("Gagal mendapatkan article_id dari response.");
      }

      console.log("✅ Artikel berhasil dikirim dengan ID:", articleId);
      return articleId;
    } catch (error) {
      console.error("❌ Error submitting article:", error);
      alert("❌ Gagal mengirim artikel. Silakan periksa kembali data Anda.");
      throw error;
    }
  };

  const saveHeadlines = async (headlines, headlineCategory = "HOME") => {
    if (!selectedPortal?.platform_id) {
      console.error("❌ Platform ID tidak ditemukan.");
      return;
    }

    const payload = {
      headlines: headlines.map((headline, index) => ({
        position: index + 1,
        article_id: headline.article_id || headline._id,
        headline_category: headlineCategory, // ✅ WAJIB ditambahkan ke setiap item
      })),
    };

    try {
      const response = await customPost(
        `/api/headlines?platform_id=${selectedPortal.platform_id}`,
        payload
      );
      console.log("✅ Headlines berhasil disimpan:", response);
    } catch (error) {
      console.error("❌ Gagal menyimpan headlines:", error);
    }
  };

  const getHeadlines = async (platformId, headlineCategory = "HOME") => {
    if (!platformId) return;

    try {
      const response = await customGet(
        `/api/headlines?platform_id=${platformId}&headline_category=${headlineCategory}`
      );
      console.log("✅ Data headlines dari backend:", response.data);

      return response.data || [];
    } catch (error) {
      console.error("❌ Error fetching headlines:", error);
      throw error;
    }
  };

  // ✅ Fungsi untuk mendapatkan artikel Editor Choice
  const getEditorChoice = async (platformId) => {
    if (!platformId) return;

    try {
      const response = await customGet(
        `/api/editor-choices?platform_id=${platformId}&limit=40`
      );
      return response?.data || [];
    } catch (error) {
      console.error("❌ Error fetching editor choices:", error);
      throw error;
    }
  };

  // ✅ Fungsi untuk menyimpan artikel Editor Choice
  const saveEditorChoice = async (editorChoices) => {
    if (!selectedPortal?.platform_id) {
      console.error("❌ Platform ID tidak ditemukan.");
      return;
    }

    const payload = {
      editor_choices: editorChoices.map((choice, index) => ({
        position: index + 1,
        article_id: choice.article_id,
      })),
    };

    try {
      const response = await customPost(
        `/api/editor-choices?platform_id=${selectedPortal.platform_id}`,
        payload
      );

      console.log("✅ Editor choices berhasil disimpan:", response);
    } catch (error) {
      console.error("❌ Gagal menyimpan editor choices:", error);
    }
  };

  // ✅ Fungsi untuk mengambil artikel berdasarkan platform_id
  // Di BackProvider
  const getArticles = useCallback(async (platformId, page = 1, limit = 10) => {
    if (!platformId) return;
    try {
      const response = await customGet(
        `/api/articles?platform_id=${platformId}&page=${page}&limit=${limit}&status=all`
      );
      setArticles(response.data);
      return response;
    } catch (error) {
      console.error("Error fetching articles:", error);
      throw error;
    }
  }, []); // dependency kosong, jika tidak tergantung pada state lain

  const getArticlesLink = useCallback(
    async (platformId, page = 1, limit = 15) => {
      if (!platformId) return;
      try {
        const response = await customGet(
          `/api/articles?platform_id=${platformId}&page=${page}&limit=${limit}&status=all`
        );
        setArticles(response.data);
        return response;
      } catch (error) {
        console.error("Error fetching articles:", error);
        throw error;
      }
    },
    []
  ); // dependency kosong, jika tidak tergantung pada state lain

  const getArticlesPublish = useCallback(
    async (platformId, page = 1, limit = 10) => {
      if (!platformId) return;
      try {
        const response = await customGet(
          `/api/articles?platform_id=${platformId}&page=${page}&limit=${limit}&status=publish`
        );

        // ✅ Pakai optional chaining untuk menghindari undefined error
        setArticles(response?.data || []);
        return response;
      } catch (error) {
        console.error("❌ Error fetching pending articles:", error);
        throw error;
      }
    },
    [setArticles] // ✅ Tambahkan setArticles sebagai dependensi
  );

  const getArticlesPending = useCallback(
    async (platformId, page = 1, limit = 10) => {
      if (!platformId) return;
      try {
        const response = await customGet(
          `/api/articles?platform_id=${platformId}&page=${page}&limit=${limit}&status=Pending`
        );

        // ✅ Pakai optional chaining untuk menghindari undefined error
        setArticles(response?.data || []);
        return response;
      } catch (error) {
        console.error("❌ Error fetching pending articles:", error);
        throw error;
      }
    },
    [setArticles] // ✅ Tambahkan setArticles sebagai dependensi
  );

  const getArticlesReject = useCallback(
    async (platformId, page = 1, limit = 10) => {
      if (!platformId) return;
      try {
        const response = await customGet(
          `/api/articles?platform_id=${platformId}&page=${page}&limit=${limit}&status=reject`
        );

        // ✅ Pakai optional chaining untuk menghindari undefined error
        setArticles(response?.data || []);
        return response;
      } catch (error) {
        console.error("❌ Error fetching pending articles:", error);
        throw error;
      }
    },
    [setArticles] // ✅ Tambahkan setArticles sebagai dependensi
  );

  const getDraftArticles = async () => {
    if (!selectedPortal?.platform_id || !user?.user_id) return;

    try {
      const response = await customGet(
        `/api/articles?&platform_id=${selectedPortal.platform_id}&author_id=${user.user_id}&page=1&limit=50&status=Draft`
      );
      setArticles(response?.data || []);
      setDraftMeta(response.meta); // ✅ simpan meta
    } catch (error) {
      console.error("❌ Error fetching draft articles:", error);
    }
  };

  const getAuthorArticles = useCallback(async () => {
    if (!selectedPortal?.platform_id || !user?.user_id) return;

    try {
      const response = await customGet(
        `/api/articles?platform_id=${selectedPortal.platform_id}&author_id=${user.user_id}&page=1&limit=50&status=all`
      );
      setArticles(response?.data || []);
      setDraftMeta(response.meta);
    } catch (error) {
      console.error("❌ Error fetching author articles:", error);
    }
  }, [selectedPortal?.platform_id, user?.user_id]);

  // ✅ Fungsi untuk mengambil kategori berdasarkan platform_id
  const getCategoriesByPlatformId = async (platformId) => {
    if (!platformId) return [];

    try {
      const response = await customGet(
        `/api/categories?platform_id=${platformId}`
      );
      console.log("✅ Data kategori dari backend:", response?.data || []);

      return response?.data || [];
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
      return [];
    }
  };

  // ✅ Update selected platform dan simpan di localStorage
  const updatePlatform = (platform) => {
    if (!platform) return;

    console.log("✅ Portal dipilih:", platform);
    localStorage.setItem("selectedPortal", JSON.stringify(platform));
    setSelectedPortal(platform);
  };

  // ✅ Fungsi untuk mengambil artikel berdasarkan article_id
  const getArticleById = async (articleId) => {
    if (!articleId) return null;

    const url = `/api/articles/${articleId}`;
    console.log("🌐 Fetching URL:", url); // ⬅️ log ini WAJIB muncul

    try {
      const article = await customGet(url);
      console.log("✅ Artikel ditemukan dari API:", article);
      return article || null;
    } catch (error) {
      console.error("❌ Gagal mengambil artikel berdasarkan ID:", error);
      return null;
    }
  };

  const getArticlesByCategory = async (
    platformId,
    category,
    page = 1,
    limit = 10
  ) => {
    if (!platformId || !category) return;

    try {
      const response = await customGet(
        `/api/articles?platform_id=${platformId}&category=${category}&page=${page}&limit=${limit}&status=publish`
      );

      // Simpan ke state jika diperlukan
      setArticles(response?.data || []);
      return response;
    } catch (error) {
      console.error("❌ Error fetching articles by category:", error);
      throw error;
    }
  };

  // handleEditArticle.js
  const handleEditArticle = (articleId, router) => {
    router.push(`/dashboard/edit-artikel/${articleId}`);
  };

  const submitEditedArticle = async (articleId, articleData) => {
    if (!articleId) {
      alert("❗ ID artikel tidak valid.");
      return;
    }

    // 💥 Exclude field yang tidak boleh dikirim ke backend
    const {
      imageFile,
      author,
      created_at,
      updated_at,
      ...articleWithoutImage
    } = articleData || {};

    let imageUrl = null;
    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (error) {
        console.error("❌ Gagal upload gambar:", error);
      }
    }

    const payload = {
      ...articleWithoutImage,
      image: imageUrl || articleData.image || "",
      status: "Pending", // ✅ Tambahkan ini
      tags: Array.isArray(articleWithoutImage.tags)
        ? articleWithoutImage.tags.map((tag) =>
            tag.trim().toLowerCase().replace(/\s+/g, "-")
          )
        : typeof articleWithoutImage.tags === "string"
        ? articleWithoutImage.tags
            .split(",")
            .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, "-"))
        : [],
    };

    try {
      const response = await customPut(`/api/articles/${articleId}`, payload);
      console.log("✅ Artikel berhasil diperbarui:", response);
      return response;
    } catch (error) {
      console.error("❌ Gagal update artikel:", error);
      throw error;
    }
  };

  const deleteArticleById = async (articleId) => {
    if (!articleId) throw new Error("ID artikel tidak valid");

    try {
      const response = await customDelete(`/api/articles/${articleId}`);
      console.log("🗑️ Artikel berhasil dihapus:", response);
      return response;
    } catch (error) {
      console.error("❌ Gagal menghapus artikel:", error);
      throw error;
    }
  };

  const uploadArticleImage = async (file) => {
    if (!file) throw new Error("Tidak ada file yang dipilih.");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await customPost("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Gambar berhasil diupload:", response);
      return response?.url || null; // asumsikan backend mengembalikan { url: "..." }
    } catch (error) {
      console.error("❌ Upload gambar gagal:", error);
      throw error;
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
        article_id: articleId, // Kirimkan article_id ke backend
        status: "publish", // Status yang ingin diubah
      });

      console.log("Response:", response); // Log response dari backend

      if (response?.article_id) {
        console.log(
          `Artikel dengan ID ${articleId} telah disetujui dan dipublikasikan.`
        );
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

  const getAllUsers = async () => {
    try {
      const response = await customGet("/api/users");
      return Array.isArray(response) ? response : []; // Langsung response, bukan response.data
    } catch (error) {
      console.error("❌ Gagal mengambil daftar pengguna:", error);
      return [];
    }
  };

  const getAllPlatforms = async () => {
    try {
      const response = await customGet("/api/platforms");

      // FIX di sini
      const allPlatforms = Array.isArray(response?.data) ? response.data : [];

      const uniquePlatforms = [];
      const seen = new Set();

      for (const platform of allPlatforms) {
        if (platform && !seen.has(platform.platform_id)) {
          seen.add(platform.platform_id);
          uniquePlatforms.push(platform);
        }
      }

      return uniquePlatforms;
    } catch (error) {
      console.error("❌ Gagal mengambil daftar platform:", error);
      return [];
    }
  };

  // Di BackContext: tambahkan fungsi ini (kalau belum ada)
  const getPlatformAccessByUser = async (userId) => {
    try {
      const res = await customGet(`/api/platform-access?user_id=${userId}`);
      return res?.data || [];
    } catch (error) {
      console.error("❌ Gagal mengambil platform access user:", error);
      return [];
    }
  };

  const getPlatformAccessByUserId = async (userId) => {
    try {
      const res = await customGet(`/api/platform-access?user_id=${userId}`);
      return Array.isArray(res?.data) ? res.data : [];
    } catch (err) {
      console.error("❌ Gagal ambil akses platform:", err);
      return [];
    }
  };

  const createUser = async (payload) => {
    try {
      const res = await customPost("/api/users", payload); // ⬅️ langsung kirim payload, JANGAN destruktur tanpa platform_ids
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const getUserById = async (userId) => {
    try {
      const response = await customGet(`/api/users/${userId}`);
      return response; // ✅ langsung return karena data user langsung di root
    } catch (error) {
      console.error("❌ Gagal mengambil user:", error);
      throw error;
    }
  };

  const deletePlatformAccessByUserId = async (userId) => {
    try {
      await customDelete(`/api/platform-access/${userId}`); // endpoint-nya bisa disesuaikan
    } catch (error) {
      console.error("❌ Gagal menghapus akses platform:", error);
      throw error;
    }
  };

  const deleteUserById = async (userId) => {
    try {
      const response = await customDelete(`/api/users/${userId}`);
      console.log("🗑️ User berhasil dihapus:", response);
      return response;
    } catch (error) {
      // Jangan tampilkan error lengkap di console untuk user biasa
      // console.error("❌ Gagal menghapus user:", error);

      // Bisa ganti dengan pesan aman untuk developer (opsional)
      console.warn(
        "❌ Gagal menghapus user. Pastikan platform access dihapus terlebih dahulu."
      );

      // Tetap lempar error agar handler di UI bisa tangani swal-nya
      throw new Error(
        "Gagal menghapus user. Silakan hapus akses platform dari menu edit."
      );
    }
  };

  const addPlatformAccess = async (userId, platformId) => {
    try {
      const response = await customPost("/api/platform-access", {
        user_id: userId,
        platform_id: platformId,
      });
      return response;
    } catch (error) {
      console.error("❌ Gagal menambahkan akses platform:", error);
      throw error;
    }
  };

  const updateUserPlatformAccess = async (userId, platformIds) => {
    try {
      await customPut(`/api/platform-access/${userId}`, {
        platform_ids: platformIds, // array of IDs
      });
    } catch (error) {
      console.error("❌ Gagal update akses platform:", error);
      throw error;
    }
  };

  const updateUsers = async (userData) => {
    const userId = userData.user_id;
    if (!userId) throw new Error("User ID tidak tersedia");

    const { user_id, ...payload } = userData;

    try {
      const response = await customPut(`/api/users/${userId}`, payload, {});

      return response?.data;
    } catch (error) {
      console.error("❌ Gagal update user:", error);
      throw error;
    }
  };

  const updateProfile = async (updatedUser) => {
    try {
      // ✅ Kirim request ke backend dengan data terbaru
      const response = await customPut(
        `/api/users/${updatedUser.user_id}`,
        updatedUser
      );

      // ✅ Jika respons dari backend sukses, update state dan localStorage
      if (response?.data) {
        const newProfile = response.data;

        // ✅ Update state React dengan data terbaru dari backend
        setUser(newProfile);

        // ✅ Update localStorage dengan data user terbaru
        localStorage.setItem("currentUser", JSON.stringify(newProfile));

        return newProfile;
      } else {
        throw new Error(response?.message || "Gagal memperbarui profil");
      }
    } catch (error) {
      console.error("Error updating profile:", error);

      // ✅ Tampilkan error hanya jika ada pesan dari backend
      if (error.response?.data?.message) {
        alert(`❌ ${error.response.data.message}`);
      } else {
        alert("❌ Terjadi kesalahan saat memperbarui profil.");
      }

      throw error;
    }
  };

  const changePassword = async (
    old_password,
    password,
    router,
    setError,
    setNotification
  ) => {
    try {
      const payload = {
        old_password,
        password,
      };

      // Kirim request PUT ke endpoint `/api/users/{userId}`
      const response = await customPut(`/api/users/${user.user_id}`, payload);

      if (
        response?.success ||
        response?.updatedUser ||
        response?.message === "User updated successfully"
      ) {
        const updatedUser = response.updatedUser;
        setUser(updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));

        // ✅ Jika berhasil, panggil notifikasi custom (type: "success")
        setNotification({
          type: "success",
          message: "Password berhasil diubah! Silakan login kembali.",
        });

        // ✅ Bersihkan sesi dan redirect ke login setelah menutup popup
        setTimeout(() => {
          setUser(null);
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
        }, 500);
      } else {
        // ✅ Jika respons gagal dan pesan dari backend adalah "Old password is incorrect"
        if (response.message === "Old password is incorrect") {
          setNotification({
            type: "error",
            message: "❌ Password lama salah! Silakan coba lagi.",
          });
          return;
        }

        // ✅ Jika pesan error lain, tampilkan notifikasi error
        setNotification({
          type: "error",
          message:
            response.message || "❌ Terjadi kesalahan saat mengubah password.",
        });
        return;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message;

      // ✅ Tampilkan pesan hanya jika password lama salah
      if (errorMessage === "Old password is incorrect") {
        setNotification({
          type: "error",
          message: "❌ Password lama salah! Silakan coba lagi.",
        });
        return;
      }

      // ✅ Jika error lain → Tampilkan notifikasi error
      setNotification({
        type: "error",
        message: "❌ Terjadi kesalahan saat mengubah password.",
      });
      return;
    }
  };

  const searchArticles = useCallback(async (query, platformId) => {
    if (!query) return [];
  
    const finalPlatformId =
      platformId ||
      JSON.parse(localStorage.getItem("selectedPortal") || "{}")?.platform_id ||
      1;
  
    try {
      const response = await customGet(
        `/api/articles?search=${encodeURIComponent(query)}&platform_id=${finalPlatformId}`
      );
      return response?.data || [];
    } catch (error) {
      console.error("❌ Failed to search articles:", error);
      return [];
    }
  }, []);
  

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
      setDraftMeta,
      setSelectedPortal, // ✅ PASTIKAN DIEKSPORT DI SINI
      setArticles, // ✅ Expose setArticles agar bisa diakses di komponen
      setSuccessPopup,
      submitArticle, // Fungsi submit artikel
      uploadImage, // Fungsi upload gambar
      getDraftArticles,
      setArticleData,
      updateArticleData,
      updatePlatform,
      saveDraft,
      saveEditedDraft,
      getArticles,
      getArticlesLink,
      getArticlesPublish,
      getArticlesPending,
      getArticlesReject,
      login,
      logout,
      getEditorChoice, // ✅ Fungsi GET untuk Editor Choice
      saveEditorChoice, // ✅ Fungsi POST untuk menyimpan Editor Choic
      saveHeadlines,
      getHeadlines,
      approveArticle, // Menambahkan fungsi approveArticle
      updateProfile, // <-- fungsi updateProfile ditambahkan di sini
      changePassword, // <-- fungsi baru ditambahkan di sini
      getCategoriesByPlatformId, // ✅ Tambahkan di sini
      getArticleById,
      handleEditArticle, // ✅ Tambahkan ini
      submitEditedArticle,
      uploadArticleImage,
      getArticlesByCategory,
      deleteArticleById,
      getAllUsers,
      createUser,
      deleteUserById,
      addPlatformAccess,
      getAllPlatforms,
      getPlatformAccessByUser,
      getUserById,
      getPlatformAccessByUserId,
      updateUsers,
      updateUserPlatformAccess,
      deletePlatformAccessByUserId,
      getAuthorArticles,
      searchArticles,
      searchResults,
      searchLoading,
    }),
    [
      user,
      role,
      token,
      platforms,
      articleData,
      articles,
      selectedPortal,
      isSuccessPopup,
    ]
  );

  return (
    <BackContext.Provider value={contextValue}>{children}</BackContext.Provider>
  );
};

export function useBackend() {
  return useContext(BackContext);
}
