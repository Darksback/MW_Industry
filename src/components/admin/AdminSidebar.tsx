"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, LogOut, Menu, X, Newspaper, Megaphone, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AdminSidebar({ logoutAction }: { logoutAction: (formData: FormData) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Orders", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Articles", href: "/admin/articles", icon: Newspaper },
    { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
    { name: "Hero Carousel", href: "/admin/hero", icon: ImagePlus },
  ];


  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-border/50 bg-card sticky top-0 z-40">
        <Link href="/admin/dashboard" className="font-bebas text-xl tracking-wide text-foreground">
          MW<span className="text-primary">INDUSTRY</span>
          <span className="text-muted-foreground text-xs ml-2 tracking-normal font-sans font-medium uppercase">Admin</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </header>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1a1a] border-r border-white/5 p-6 flex flex-col transition-transform duration-300 md:translate-x-0 md:static md:h-screen md:sticky md:top-0 shadow-2xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="mb-8 hidden md:flex items-center">
          <Link href="/admin/dashboard" className="font-bebas text-2xl tracking-wide text-white">
            MW<span className="text-primary">INDUSTRY</span>
            <span className="text-gray-500 text-sm ml-2 tracking-normal font-sans font-medium uppercase">Admin</span>
          </Link>
        </div>

        <nav className="space-y-2 flex-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl transition-all font-medium",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className={cn("w-5 h-5 mr-3", isActive ? "text-white" : "text-gray-500")} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <form action={logoutAction} className="mt-8 border-t border-white/5 pt-6">
          <button 
            type="submit"
            className="w-full flex items-center px-4 py-3 text-gray-500 hover:bg-destructive/10 hover:text-destructive rounded-xl transition-colors font-medium"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </form>
      </aside>
    </>
  );
}
