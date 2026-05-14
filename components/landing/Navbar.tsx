import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-background">
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <BrainCircuit className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold tracking-tight">DevMind</span>
      </Link>
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition"
        >
          Sign Up Free
        </Link>
      </div>
    </nav>
  );
}