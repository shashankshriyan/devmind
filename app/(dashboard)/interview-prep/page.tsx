"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactMarkdown from "react-markdown";

const TOPICS = [
  "Arrays",
  "Strings",
  "Linked Lists",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Recursion",
  "Sorting",
  "Binary Search",
  "System Design",
];

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];
const TYPES = ["DSA", "System Design", "Behavioral", "JavaScript", "TypeScript"];

export default function InterviewPrepPage() {
  const [topic, setTopic] = useState("Arrays");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [type, setType] = useState("DSA");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setQuestion("");
    setSaved(false);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, type }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setQuestion(data.question);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSolved = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/interview", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, question }),
      });

      if (res.ok) {
        setSaved(true);
      }
    } catch (err) {
      setError("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
 
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Interview Prep</h1>
        <p className="text-muted-foreground mt-1">
          Generate interview questions and track your practice
        </p>
      </div>


      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 border rounded-lg bg-card">

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Topic</p>
          <Select value={topic} onValueChange={setTopic}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select topic" />
            </SelectTrigger>
            <SelectContent>
              {TOPICS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>


        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Difficulty</p>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTIES.map((d) => (
                <SelectItem key={d} value={d}>
                  {d.charAt(0) + d.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

     
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Type</p>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

  
        <div className="space-y-1">
          <p className="text-xs text-transparent font-medium">Action</p>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "🎯 Generate Question"}
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md mb-4">
          {error}
        </p>
      )}

    
      {!question && !loading && (
        <div className="border rounded-lg p-12 flex flex-col items-center justify-center text-center bg-card">
          <span className="text-5xl mb-4">🎯</span>
          <h3 className="font-semibold text-lg mb-2">Ready to Practice</h3>
          <p className="text-muted-foreground text-sm">
            Select a topic, difficulty and type then click Generate Question
          </p>
        </div>
      )}

      {loading && (
        <div className="border rounded-lg p-12 flex flex-col items-center justify-center text-center bg-card">
          <span className="text-5xl mb-4 animate-pulse">🤔</span>
          <h3 className="font-semibold text-lg mb-2">Generating Question...</h3>
          <p className="text-muted-foreground text-sm">
            AI is preparing your question
          </p>
        </div>
      )}

      {question && (
        <div className="border rounded-lg bg-card">
   
          <div className="p-6 prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{question}</ReactMarkdown>
          </div>

  
          <div className="border-t p-4 flex items-center gap-3">
            {saved ? (
              <p className="text-sm text-green-600 font-medium">
                ✅ Saved to practice log!
              </p>
            ) : (
              <>
                <Button
                  onClick={handleSolved}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {saving ? "Saving..." : "✅ Mark as Solved"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  ⏭️ Skip — Next Question
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}