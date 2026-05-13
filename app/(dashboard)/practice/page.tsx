"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
    loading: () => (
        <div className="h-48 w-full flex items-center justify-center bg-muted rounded-lg">
            <p className="text-muted-foreground text-sm">Loading editor...</p>
        </div>
    ),
});

type Difficulty = "EASY" | "MEDIUM" | "HARD";

interface PracticeLog {
    id: string;
    topic: string;
    difficulty: Difficulty;
    question: string;
    answer?: string;
    solvedAt: string;
}

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
    EASY: "bg-green-100 text-green-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HARD: "bg-red-100 text-red-700",
};

const LANGUAGES = ["javascript", "typescript", "python", "java", "cpp", "go", "rust"];

const EMPTY_FORM = {
    topic: "",
    difficulty: "EASY" as Difficulty,
    question: "",
    answer: "",
};

export default function PracticePage() {
    const [logs, setLogs] = useState<PracticeLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [confirmId, setConfirmId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editorLanguage, setEditorLanguage] = useState("javascript");
    const [editId, setEditId] = useState<string | null>(null);

    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => {
        fetch("/api/practice")
            .then((res) => res.json())
            .then((data) => {
                setLogs(data.logs);
                setLoading(false);
            });
    }, []);

    const handleEditOpen = (log: PracticeLog) => {
        setEditId(log.id);
        setForm({
            topic: log.topic,
            difficulty: log.difficulty,
            question: log.question,
            answer: log.answer || "",
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditId(null);
        setForm(EMPTY_FORM);
    };

    const handleSubmit = async () => {
        if (!form.topic || !form.question) return;
        setSubmitting(true);

        if (editId) {

            const res = await fetch(`/api/practice?id=${editId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            setLogs((prev) => prev.map((l) => (l.id === editId ? data.log : l)));
            setEditId(null);
        } else {

            const res = await fetch("/api/practice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            setLogs((prev) => [data.log, ...prev]);
        }

        setForm(EMPTY_FORM);
        setShowForm(false);
        setSubmitting(false);
    };

    const handleDelete = async () => {
        if (!confirmId) return;
        setDeleting(confirmId);
        setConfirmId(null);
        await fetch(`/api/practice?id=${confirmId}`, { method: "DELETE" });
        setLogs((prev) => prev.filter((l) => l.id !== confirmId));
        setDeleting(null);
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-8">


            {confirmId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card border rounded-xl p-6 shadow-xl w-full max-w-sm mx-4">
                        <div className="text-center mb-4">
                            <span className="text-4xl mb-3 block">🗑️</span>
                            <h3 className="text-lg font-semibold mb-1">Delete Log?</h3>
                            <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setConfirmId(null)} className="flex-1 px-4 py-2 text-sm font-medium border rounded-md hover:bg-muted transition">
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="flex-1 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Practice Log</h1>
                    <p className="text-muted-foreground mt-1">Track problems you have solved</p>
                </div>
                <button
                    onClick={() => showForm && !editId ? handleCancel() : (setShowForm(true), setEditId(null), setForm(EMPTY_FORM))}
                    className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    {showForm ? "✕ Cancel" : "+ Log Problem"}
                </button>
            </div>


            {showForm && (
                <div className="border rounded-lg p-6 bg-card mb-6 space-y-4">
                    <h2 className="font-semibold text-lg">
                        {editId ? "✏️ Edit Log" : "📝 Log a Problem"}
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Topic</label>
                            <input
                                type="text"
                                placeholder="e.g. Arrays, Trees, DP"
                                value={form.topic}
                                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Difficulty</label>
                            <select
                                value={form.difficulty}
                                onChange={(e) => setForm({ ...form, difficulty: e.target.value as Difficulty })}
                                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                            >
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1 block">Question</label>
                        <textarea
                            placeholder="What was the problem?"
                            value={form.question}
                            onChange={(e) => setForm({ ...form, question: e.target.value })}
                            rows={3}
                            className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-sm font-medium">
                                Your Solution <span className="text-muted-foreground">(optional)</span>
                            </label>
                            <select
                                value={editorLanguage}
                                onChange={(e) => setEditorLanguage(e.target.value)}
                                className="border rounded-md px-2 py-1 text-xs bg-background"
                            >
                                {LANGUAGES.map((lang) => (
                                    <option key={lang} value={lang}>
                                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="border rounded-md overflow-hidden">
                            <MonacoEditor
                                height="200px"
                                language={editorLanguage}
                                value={form.answer}
                                onChange={(value) => setForm({ ...form, answer: value || "" })}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 13,
                                    lineNumbers: "on",
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2 text-sm font-medium border rounded-md hover:bg-muted transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || !form.topic || !form.question}
                            className="bg-blue-600 text-white text-sm font-medium px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {submitting ? "Saving..." : editId ? "✅ Save Changes" : "✅ Save Log"}
                        </button>
                    </div>
                </div>
            )}


            {logs.length === 0 ? (
                <div className="text-center py-20 border rounded-lg">
                    <span className="text-5xl mb-4 block">📝</span>
                    <h3 className="font-semibold text-lg mb-2">No logs yet</h3>
                    <p className="text-muted-foreground text-sm">Start logging problems you have solved!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {logs.map((log) => (
                        <div key={log.id} className="border rounded-lg bg-card overflow-hidden">
                            <div className="flex items-center justify-between p-5">
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${DIFFICULTY_COLORS[log.difficulty]}`}>
                                        {log.difficulty}
                                    </span>
                                    <span className="text-sm font-medium">{log.topic}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(log.solvedAt).toLocaleDateString("en-IN", {
                                            day: "numeric", month: "short", year: "numeric",
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setExpanded(expanded === log.id ? null : log.id)}
                                        className="text-xs font-medium bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition"
                                    >
                                        {expanded === log.id ? "▲ Hide" : "▼ View"}
                                    </button>
                                    <button
                                        onClick={() => handleEditOpen(log)}
                                        className="text-xs font-medium bg-yellow-500 text-white px-3 py-1.5 rounded-md hover:bg-yellow-600 transition"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={() => setConfirmId(log.id)}
                                        disabled={deleting === log.id}
                                        className="text-xs font-medium bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition disabled:opacity-50"
                                    >
                                        {deleting === log.id ? "Deleting..." : "🗑 Delete"}
                                    </button>
                                </div>
                            </div>

                            <div className="px-5 pb-4">
                                <p className="text-sm text-muted-foreground line-clamp-2">{log.question}</p>
                            </div>

                            {expanded === log.id && (
                                <div className="px-5 pb-6 border-t pt-4 space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-sm mb-2">❓ Question</h3>
                                        <p className="text-sm bg-muted rounded-md p-3">{log.question}</p>
                                    </div>
                                    {log.answer && (
                                        <div>
                                            <h3 className="font-semibold text-sm mb-2">✅ Your Solution</h3>
                                            <div className="border rounded-md overflow-hidden">
                                                <MonacoEditor
                                                    height="200px"
                                                    value={log.answer}
                                                    theme="vs-dark"
                                                    options={{
                                                        readOnly: true,
                                                        minimap: { enabled: false },
                                                        fontSize: 13,
                                                        lineNumbers: "on",
                                                        scrollBeyondLastLine: false,
                                                        automaticLayout: true,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}