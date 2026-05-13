import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="p-8">
  
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s your progress overview
        </p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: "Code Reviews",    value: "0", desc: "Total reviews done",    icon: "🔍" },
          { title: "Problems Solved", value: "0", desc: "Total problems solved", icon: "✅" },
          { title: "Current Streak",  value: "0", desc: "Days in a row",         icon: "🔥" },
        ].map((stat) => (
          <div key={stat.title} className="border rounded-lg p-6 bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
          </div>
        ))}
      </div>

  
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Review Code",       desc: "Paste your code and get AI feedback", href: "/code-review",    icon: "🔍" },
            { title: "Practice Interview", desc: "Generate questions by topic",         href: "/interview-prep", icon: "🎯" },
            { title: "Log Practice",       desc: "Track problems you have solved",      href: "/practice",       icon: "📝" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="border rounded-lg p-5 bg-card hover:bg-accent transition-colors block"
            >
              <span className="text-2xl mb-2 block">{action.icon}</span>
              <h3 className="font-semibold mb-1">{action.title}</h3>
              <p className="text-sm text-muted-foreground">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}