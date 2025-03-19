import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http', // Atau 'https' jika menggunakan https
        hostname: '156.67.217.169',
        port: '9001', // Jika ada port, tambahkan disini. Misalnya '9001'.
        pathname: '/**', // Menunjukkan seluruh path gambar
      },
    ],
  },
};

export default nextConfig;
