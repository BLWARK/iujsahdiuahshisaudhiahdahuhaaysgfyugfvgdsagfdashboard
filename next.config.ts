/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http", // karena `user.avatar` pakai http
        hostname: "156.67.217.169",
        port: "9001", // jika diperlukan
        pathname: "/**", // untuk semua path
      },
      {
        protocol: "https", // juga tambahkan jika image bisa dari https (optional)
        hostname: "storage.xyzone.media",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
