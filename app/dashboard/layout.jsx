import Sidebar from "@/components/sidebar/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar Tetap */}
      <Sidebar />

      {/* Konten Dashboard */}
      <main className="flex-1  overflow-y-auto bg-gray-100 p-6 text-main">
        {children}
      </main>
    </div>
  );
}
