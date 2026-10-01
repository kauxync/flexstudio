"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  product: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string;
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      const d = await res.json();
      setReviews(d.reviews || []);
    } catch {
      showToast("Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this customer review?")) return;
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews(reviews.filter((r) => r.id !== id));
        showToast("Review deleted and product rating updated");
      } else {
        showToast("Failed to delete review", "error");
      }
    } catch {
      showToast("Network error deleting review", "error");
    }
  };

  const handleToggleVerified = async (review: ReviewItem) => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: review.id, verified: !review.verified }),
      });
      if (res.ok) {
        setReviews(reviews.map((r) => (r.id === review.id ? { ...r, verified: !r.verified } : r)));
        showToast(`Review verification updated`);
      }
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const filtered = reviews.filter((r) => {
    const matchesRating = ratingFilter === "all" || r.rating === ratingFilter;
    const matchesSearch =
      searchQuery === "" ||
      Boolean(r.product?.title && r.product.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      Boolean(r.user?.name && r.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      Boolean(r.comment && r.comment.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRating && matchesSearch;
  });

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-scale-in">
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-xl text-xs font-semibold ${
              toast.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {toast.message}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-gold font-bold px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20">
              Reputation
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Customer Reviews
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Moderate customer feedback, verify purchases, and ensure review authenticity.
          </p>
        </div>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
          <span className="text-xs text-muted-foreground block">Overall Marketplace Rating</span>
          <span className="text-xl font-bold text-amber-400 flex items-center gap-1.5 mt-0.5">
            <Star className="w-5 h-5 fill-amber-400" />
            {avgRating} / 5.0
          </span>
        </div>
        <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
          <span className="text-xs text-muted-foreground block">Total Reviews</span>
          <span className="text-xl font-bold text-foreground">{reviews.length}</span>
        </div>
        <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
          <span className="text-xs text-muted-foreground block">Verified Purchases</span>
          <span className="text-xl font-bold text-emerald-400">
            {reviews.filter((r) => r.verified).length}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search by product, reviewer, or review keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 text-xs bg-background/60 border border-border/40 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>

        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/30 w-full md:w-auto overflow-x-auto">
          {(["all", 5, 4, 3, 2, 1] as const).map((star) => (
            <button
              key={String(star)}
              onClick={() => setRatingFilter(star)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                ratingFilter === star
                  ? "bg-gold text-primary-fg font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {star === "all" ? "All Stars" : `${star} ★`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table */}
      <div className="rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">
            <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading reviews...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground space-y-2">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/30" />
            <p className="text-sm font-medium text-foreground">No customer reviews found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/30 bg-muted/20 text-muted-foreground/80">
                  <th className="py-3.5 px-4 font-semibold">Product</th>
                  <th className="py-3.5 px-4 font-semibold">Reviewer</th>
                  <th className="py-3.5 px-4 font-semibold">Rating</th>
                  <th className="py-3.5 px-4 font-semibold">Comment</th>
                  <th className="py-3.5 px-4 font-semibold">Verified</th>
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filtered.map((rev) => (
                  <tr key={rev.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.product?.thumbnail || "/placeholder.png"}
                          alt={rev.product?.title || "Product"}
                          className="w-9 h-9 rounded-lg object-cover border border-border/30 shrink-0"
                        />
                        <span className="font-semibold text-foreground truncate max-w-[140px]">
                          {rev.product?.title || "Product"}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-foreground truncate max-w-[120px]">
                        {rev.user?.name || "Anonymous"}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                        {rev.user?.email || "No email"}
                      </p>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="text-muted-foreground max-w-xs line-clamp-2 leading-relaxed">
                        {rev.comment}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleVerified(rev)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all ${
                          rev.verified
                            ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                            : "bg-muted text-muted-foreground border-border/30"
                        }`}
                        title="Click to toggle verified"
                      >
                        {rev.verified ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </>
                        ) : (
                          "Unverified"
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                      {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(rev.id)}
                        className="p-1.5 rounded-lg border border-border/30 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
