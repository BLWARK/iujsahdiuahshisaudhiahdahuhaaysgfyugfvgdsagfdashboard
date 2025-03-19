import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { BackProvider } from "@/context/BackContext";

// import ScrollTop from "@/components/scroll-to-top/Scroll"
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "500", "600", "700", "800", "900"], // Menambahkan weight untuk font
});

export const metadata: Metadata = {
  title: "Coinzone Dashboard",
  description: "Coinzone Media",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <BackProvider>
        <div className="flex flex-col justify-center items-center overflow-hidden bg-gray-100 w-full overflow-x-auto  ">
          
          {/* Hero Section */}
          <div className="text-black w-full px-0 ">{children}</div>
         
        </div>
        </BackProvider>
      </body>
    </html>
  );
}
