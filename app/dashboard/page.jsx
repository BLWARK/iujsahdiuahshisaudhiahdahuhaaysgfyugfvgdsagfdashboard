"use client";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { BackContext } from "@/context/BackContext";

const DashboardPage = () => {
  const { getUserArticleCount } = useContext(BackContext);
  const [user, setUser] = useState(null);
  const [articleCount, setArticleCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const fetchArticleCount = async () => {
      if (!user?.user_id) return;

      try {
        const allUsers = await getUserArticleCount();
        const me = allUsers.find((u) => u.userId === user.user_id);
        if (me) setArticleCount(me.articleCount);
      } catch (err) {
        console.error("Gagal ambil artikel user:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticleCount();
  }, [user]);

  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white shadow-sm rounded-md text-left">
          <h2 className="font-semibold mb-2">Total Articles</h2>
          <p className="text-lg font-bold">{articleCount}</p>
        </div>

        <div className="p-4 border rounded-md bg-white shadow-sm">
          <h3 className="font-semibold mb-2">Total Views</h3>
          <p className="font-bold text-lg">-</p>
        </div>

        <div className="p-4 border rounded-md bg-white shadow-sm">
          <h3 className="font-semibold mb-2">Total Earnings</h3>
          <p className="font-bold text-lg">IDR -</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
