import { auth } from "@/lib/auth";
import Link from "next/link";
import prisma from "@/lib/prisma";


function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const uniqueDates = [
    ...new Set(dates.map((d) => new Date(d).toDateString())),
  ];

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < uniqueDates.length; i++) {
    const expected = new Date(today);
    expected.setDate(today.getDate() - i);

    if (uniqueDates[i] === expected.toDateString()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export default async function DashboardPage() {
  const session = await auth();

  const [codeReviews, problemsSolved, practiceLogs] = await Promise.all([
    prisma.codeReview.count({
      where: { userId: session?.user?.id },
    }),
    prisma.practiceLog.count({
      where: { userId: session?.user?.id },
    }),
    prisma.practiceLog.findMany({
      where: { userId: session?.user?.id },
      orderBy: { solvedAt: "desc" },
      select: { solvedAt: true },
    }),
  ]);

  const streak = calculateStreak(practiceLogs.map((l) => l.solvedAt));

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
          {
            title: "Code Reviews",
            value: codeReviews.toString(),
            desc: "Total reviews done",
            icon: "🔍",
            href: "/code-review/history",
          },
          {
            title: "Problems Solved",
            value: problemsSolved.toString(),
            desc: "Total problems solved",
            icon: "✅",
            href: "/practice",
          },
          {
            title: "Current Streak",
            value: `${streak} 🔥`,
            desc: streak > 0 ? "Keep it up!" : "Add a log today to start!",
            icon: "🔥",
            href: "/practice",
          },
        ].map((stat) => (
          <Link
            href={stat.href}
            key={stat.title}
            className="border rounded-lg p-6 bg-card hover:bg-accent transition-colors block"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </span>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Review Code",
              desc: "Paste your code and get AI feedback",
              href: "/code-review",
              icon: "🔍",
            },
            {
              title: "Practice Interview",
              desc: "Generate questions by topic",
              href: "/interview-prep",
              icon: "🎯",
            },
            {
              title: "Log Practice",
              desc: "Track problems you have solved",
              href: "/practice",
              icon: "📝",
            },
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