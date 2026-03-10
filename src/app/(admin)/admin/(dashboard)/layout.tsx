import AdminSidebar from "../_components/AdminSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0E0E0E]">
      <AdminSidebar />
      <div className="flex-1 ml-[260px]">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
