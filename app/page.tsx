"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      router.push("/login"); // Redirect ke halaman login setelah loading
    }, 3000); // Durasi loading 3 detik

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-main">
      {isLoading && (
        <div className="flex flex-col items-center justify-center animate-fade-in">
          <div className="relative w-64 h-64">
            <Image
              src="/cz.gif"
              alt="Loading Animation"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
          <p className="text-white text-lg mt-6 animate-pulse">Loading...</p>
        </div>
      )}
    </div>
  );
}
