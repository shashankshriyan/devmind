"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactMarkdown from "react-markdown";


const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-muted rounded-lg">
      <p className="text-muted-foreground">Loading editor...</p>
    </div>
  ),
});

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
  "go",
  "rust",
  "php",
];

export default function CodeReviewPage() {
  const [code, setCode] = useState("// Paste your code here...");
  const [language, setLanguage] = useState("javascript");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReview = async () => {
    if (!code || code === "// Paste your code here...") {
      setError("Please paste some code first!");
      return;
    }

    setLoading(true);
    setError("");
    setFeedback("");

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setFeedback(data.feedback);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 h-full">
   
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Code Review</h1>
        <p className="text-muted-foreground mt-1">
          Paste your code and get instant AI feedback
        </p>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleReview} disabled={loading}>
          {loading ? "Reviewing..." : "🔍 Review Code"}
        </Button>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>


      <div className="grid grid-cols-2 gap-6 h-[calc(100vh-280px)]">
   
        <div className="border rounded-lg overflow-hidden">
          <MonacoEditor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

    
        <div className="border rounded-lg p-6 overflow-y-auto bg-card">
          {!feedback && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <span className="text-5xl mb-4">🔍</span>
              <h3 className="font-semibold text-lg mb-2">Ready to Review</h3>
              <p className="text-muted-foreground text-sm">
                Paste your code on the left and click Review Code
              </p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <span className="text-5xl mb-4 animate-pulse">🤔</span>
              <h3 className="font-semibold text-lg mb-2">Reviewing...</h3>
              <p className="text-muted-foreground text-sm">
                AI is analyzing your code
              </p>
            </div>
          )}

          {feedback && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{feedback}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}