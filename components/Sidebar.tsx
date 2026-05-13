"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Code2, 
  BrainCircuit, 
  ClipboardList, 
  LogOut,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    plan?: string;
  };
}

const navItems = [
  { label: "Dashboard",      href: "/dashboard",      icon: LayoutDashboard },
  { label: "Code Review",    href: "/code-review",    icon: Code2 },
  { label: "Interview Prep", href: "/interview-prep", icon: BrainCircuit },
  { label: "Practice",       href: "/practice",       icon: ClipboardList },
];



export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r bg-card flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <span className="text-xl font-bold">DevMind</span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Info + Logout */}
      <div className="p-4 border-t space-y-3">
        {/* Plan Badge */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-accent">
          <Crown className="h-4 w-4 text-yellow-500" />
          <span className="text-xs font-medium">
            {user?.plan === "PRO" ? "Pro Plan" : "Free Plan"}
          </span>
        </div>

        {/* User email */}
        <div className="px-3">
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}