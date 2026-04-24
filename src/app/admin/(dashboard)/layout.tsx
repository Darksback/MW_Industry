import { logout } from "@/app/actions/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <AdminSidebar logoutAction={logout} />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
