"use client";
import { useState, useEffect } from "react";
import LoginForm from "@/components/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  const [isOpening, setIsOpening] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpening(false); // Efek tirai selesai setelah 2 detik
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen">
      {/* Efek Tirai */}
      {isOpening && (
        <div className="absolute inset-0 z-50 flex">
          {/* Tirai Kiri */}
          <div className="w-1/2 bg-main animate-slide-left"></div>

          {/* Tirai Kanan */}
          <div className="w-1/2 bg-main animate-slide-right"></div>
        </div>
      )}

      {/* Konten Login */}
      <div className="flex h-screen">
        {/* Bagian Kiri: Form Login */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
          <div className="max-w-md w-full">
            <div className="w-full flex flex-col justify-center items-center">
              {/* Logo */}
              <div className="relative w-[200px] h-[100px]">
                <Image
                  src="/Logo2.png"
                  alt="Logo"
                  fill
                  priority
                  style={{
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
              </div>
              <h2 className="text-xl font-semibold text-center mb-6">
                Log in to your Account
              </h2>
              <p className="text-sm text-center mb-6 text-gray-500">
                Welcome back! Select method to log in:
              </p>
            </div>

            {/* Form Login */}
            <LoginForm />
          </div>
        </div>

        {/* Bagian Kanan: GIF Animasi */}
        <div className="hidden md:flex w-1/2 bg-blue-600 justify-center items-center">
          <div className="relative w-[640px] h-[360px]">
            <Image
              src="/cz.gif"
              alt="Illustration GIF"
              fill
              priority
              style={{
                objectFit: "fill",
                borderRadius: "8px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
