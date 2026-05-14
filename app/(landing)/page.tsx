import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sparkles, Search, Target, ClipboardList, ArrowRight } from "lucide-react";

export default async function LandingPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <>
      <section className="flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          AI Powered Developer Tool
        </div>
        <h1 className="text-5xl font-bold tracking-tight max-w-3xl mb-6">
          Review Code & Prep Interviews with AI
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-10">
          DevMind helps developers write better code, prepare for technical
          interviews, and track their practice — all in one place.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-md font-medium hover:opacity-90 transition text-lg"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="border px-8 py-3 rounded-md font-medium hover:bg-accent transition text-lg"
          >
            Login
          </Link>
        </div>
      </section>

      <section className="px-6 py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Everything you need to level up
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            Three powerful tools built for developers who want to grow
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: "AI Code Review",
                description:
                  "Paste any code and get instant feedback on bugs, improvements, performance issues and best practices.",
              },
              {
                icon: Target,
                title: "Interview Prep",
                description:
                  "Generate DSA and system design questions by topic and difficulty. Practice like it's a real interview.",
              },
              {
                icon: ClipboardList,
                title: "Practice Tracker",
                description:
                  "Log every problem you solve, track your streak and see your progress over time.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="border rounded-xl p-6 bg-card hover:shadow-md transition"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

   
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-muted-foreground text-center mb-12">
            Get started in minutes
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Free Account",
                description: "Sign up in seconds — no credit card required.",
              },
              {
                step: "02",
                title: "Pick Your Tool",
                description:
                  "Review code, generate interview questions or log practice problems.",
              },
              {
                step: "03",
                title: "Get AI Feedback",
                description:
                  "Instantly receive detailed AI feedback and improve your skills.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

     
      <section className="px-6 py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { value: "10+",  label: "Languages Supported" },
              { value: "3",    label: "AI Powered Tools" },
              { value: "100%", label: "Free to Use" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="px-6 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to level up your skills?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join developers who use DevMind to write better code and ace
            interviews.
          </p>
          <Link
            href="/register"
            className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-medium hover:opacity-90 transition text-lg"
          >
            Get Started Free →
          </Link>
        </div>
      </section>
    </>
  );
}