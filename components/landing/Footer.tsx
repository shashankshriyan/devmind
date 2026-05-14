import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t px-6 py-8">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <BrainCircuit className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold tracking-tight">DevMind</span>
        </Link>
        <p className="text-sm text-muted-foreground">
          © 2025 DevMind. Built with Next.js & AI.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/login" className="hover:text-foreground transition">
            Login
          </Link>
          <Link href="/register" className="hover:text-foreground transition">
            Sign Up
          </Link>
        </div>
      </div>
    </footer>
  );
}