"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface Review {
  id: string;
  language: string;
  code: string;
  feedback: string;
  createdAt: string;
}

export default function CodeReviewHistoryPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/review/history")
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews);
        setLoading(false);
      });
  }, []);

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(confirmId);
    setConfirmId(null);
    await fetch(`/api/review/history?id=${confirmId}`, { method: "DELETE" });
    setReviews((prev) => prev.filter((r) => r.id !== confirmId));
    setDeleting(null);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="p-8">

      {/* Custom Confirm Dialog */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border rounded-xl p-6 shadow-xl w-full max-w-sm mx-4">
            <div className="text-center mb-4">
              <span className="text-4xl mb-3 block">🗑️</span>
              <h3 className="text-lg font-semibold mb-1">Delete Review?</h3>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. The review will be permanently deleted.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 px-4 py-2 text-sm font-medium border rounded-md hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Code Review History</h1>
        <p className="text-muted-foreground mt-1">All your past code reviews</p>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-20 border rounded-lg">
          <span className="text-5xl mb-4 block">🔍</span>
          <h3 className="font-semibold text-lg mb-2">No reviews yet</h3>
          <p className="text-muted-foreground text-sm mb-4">Go review some code first!</p>
          <Link href="/code-review" className="text-primary underline text-sm">
            Start a review →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg bg-card overflow-hidden">

       
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {review.language.toUpperCase()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

         
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpanded(expanded === review.id ? null : review.id)}
                    className="flex items-center gap-1.5 text-xs font-medium bg-blue-900 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition"
                  >
                    {expanded === review.id ? "▲ Hide Review" : "▼ View Full Review"}
                  </button>
                  <button
                    onClick={() => setConfirmId(review.id)}
                    disabled={deleting === review.id}
                    className="flex items-center gap-1.5 text-xs font-medium bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition disabled:opacity-50"
                  >
                    {deleting === review.id ? "Deleting..." : "🗑 Delete"}
                  </button>
                </div>
              </div>

       
              <div className="px-5 pb-4">
                <pre className="text-sm bg-muted rounded-md p-3 overflow-x-auto max-h-24">
                  <code>{review.code.slice(0, 200)}{review.code.length > 200 ? "..." : ""}</code>
                </pre>
              </div>

          
              {expanded === review.id && (
                <div className="px-5 pb-6 border-t pt-4 space-y-4">

            
                  <div>
                    <h3 className="font-semibold text-sm mb-2">📄 Full Code</h3>
                    <pre className="text-sm bg-muted rounded-md p-3 overflow-x-auto max-h-64">
                      <code>{review.code}</code>
                    </pre>
                  </div>

            
                  <div>
                    <h3 className="font-semibold text-sm mb-2">🤖 AI Feedback</h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none border rounded-lg p-4 bg-muted/30">
                      <ReactMarkdown>{review.feedback}</ReactMarkdown>
                    </div>
                  </div>

                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}