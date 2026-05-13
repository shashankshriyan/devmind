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

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-muted rounded-lg">
      <p className="text-muted-foreground">Loading editor...</p>
    </div>
  ),
});

const LANGUAGES = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python",     value: "python" },
  { label: "Java",       value: "java" },
  { label: "C++",        value: "cpp" },
  { label: "Go",         value: "go" },
  { label: "Rust",       value: "rust" },
];

const DEFAULT_CODE: Record<string, string> = {
  javascript: `// Write your JavaScript code here\nconsole.log("Hello, World!");`,
  typescript: `// Write your TypeScript code here\nconst msg: string = "Hello, World!";\nconsole.log(msg);`,
  python:     `# Write your Python code here\nprint("Hello, World!")`,
  java:       `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}`,
  cpp:        `#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello, World!" << endl;\n  return 0;\n}`,
  go:         `package main\nimport "fmt"\nfunc main() {\n  fmt.Println("Hello, World!")\n}`,
  rust:       `fn main() {\n  println!("Hello, World!");\n}`,
};

export default function CompilerPage() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CODE["javascript"]);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLanguageChange = (val: string) => {
    setLanguage(val);
    setCode(DEFAULT_CODE[val]);
    setOutput("");
    setError("");
    setStatus("");
  };

  const handleRun = async () => {
    setLoading(true);
    setOutput("");
    setError("");
    setStatus("");

    try {
      const res = await fetch("/api/compiler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setOutput(data.output);
      setError(data.error);
      setStatus(data.status);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 h-full">

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Compiler</h1>
        <p className="text-muted-foreground mt-1">
          Write, run and test your code instantly
        </p>
      </div>

  
      <div className="flex items-center gap-4 mb-4">
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleRun} disabled={loading}>
          {loading ? "Running..." : "▶ Run Code"}
        </Button>

        {status && (
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              status === "Accepted"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status}
          </span>
        )}
      </div>

      
      <div className="grid grid-cols-2 gap-6 h-[calc(100vh-280px)]">
      
        <div className="border rounded-lg overflow-hidden">
          <MonacoEditor
            height="100%"
            language={language}
            value={code}
            onChange={(val) => setCode(val || "")}
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

 
        <div className="border rounded-lg flex flex-col overflow-hidden bg-card">
        
          <div className="border-b px-4 py-3 flex items-center gap-2">
            <span className="text-sm font-medium">Output</span>
            {loading && (
              <span className="text-xs text-muted-foreground animate-pulse">
                Running...
              </span>
            )}
          </div>

     
          <div className="flex-1 p-4 font-mono text-sm overflow-y-auto">
            {!output && !error && !loading && (
              <p className="text-muted-foreground">
                Click Run to see output here...
              </p>
            )}

            {loading && (
              <p className="text-muted-foreground animate-pulse">
                ⏳ Compiling and running...
              </p>
            )}

            {output && (
              <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
            )}

            {error && (
              <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}