import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t px-6 py-8">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧠</span>
          <span className="font-bold">DevMind</span>
        </div>
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