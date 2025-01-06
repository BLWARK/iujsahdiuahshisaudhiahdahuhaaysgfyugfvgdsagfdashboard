"use client";
import LoginForm from "@/components/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex h-screen">
      {/* Bagian Kiri: Form Login */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <div className="max-w-md w-full">
          <div className="w-full flex flex-col justify-center items-center">
          {/* Logo */}
          <div className= "relative w-[200px] h-[100px]">
            <Image
              src="/Logo2.png"
              alt="Illustration GIF"
              fill
              priority
              style={{
                objectFit: "contain",
                borderRadius: "8px",
              }}
              className=""
            />
          </div>
          <h2 className="text-xl font-semibold text-center mb-6">
            Log in to your Account
          </h2>
          <p className="text-sm text-center mb-6 text-gray-500">
            Welcome back! Select method to log in:
          </p>

          {/* Separator */}
          {/* <div className="my-4 text-center text-gray-400">
            or continue with email
          </div> */}
          </div>

          {/* Form Login */}
          <LoginForm />

          {/* Footer */}
          {/* <div className="text-sm text-center mt-4">
            Don’t have an account?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Create an account
            </a>
          </div> */}
        </div>
      </div>

      {/* Bagian Kanan: Ilustrasi dengan GIF */}
      <div className="hidden md:flex w-1/2 bg-blue-600 justify-center items-center">
        <div className="text-white text-center">
        {/* <h3 className="text-2xl font-bold mb-4">
            Connect with every application.
          </h3>
          <p className="mb-4">
            Everything you need in an easily customizable dashboard.
          </p> */}

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
              className=""
            />
          </div>
         
         
        </div>
      </div>
    </div>
  );
}
