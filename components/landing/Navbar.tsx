import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-background">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🧠</span>
        <span className="text-xl font-bold">DevMind</span>
      </div>
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