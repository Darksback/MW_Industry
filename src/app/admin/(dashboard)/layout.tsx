import Link from "next/link";
import { LayoutDashboard, Package, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-border/50 bg-card p-6 flex flex-col h-auto md:h-screen sticky top-0">
        <div className="mb-8 flex items-center">
          <Link href="/admin/dashboard" className="font-bebas text-2xl tracking-wide text-foreground">
            MW<span className="text-primary">INDUSTRY</span>
            <span className="text-muted-foreground text-sm ml-2 tracking-normal font-sans font-medium uppercase">Admin</span>
          </Link>
        </div>

        <nav className="space-y-2 flex-1">
          <Link 
            href="/admin/dashboard" 
            className="flex items-center px-4 py-3 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-lg transition-colors font-medium"
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Orders
          </Link>
          <Link 
            href="/admin/products" 
            className="flex items-center px-4 py-3 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-lg transition-colors font-medium"
          >
            <Package className="w-5 h-5 mr-3" />
            Products
          </Link>
        </nav>

        <form action={logout} className="mt-8 border-t border-border/50 pt-6">
          <button 
            type="submit"
            className="w-full flex items-center px-4 py-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors font-medium"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </form>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
