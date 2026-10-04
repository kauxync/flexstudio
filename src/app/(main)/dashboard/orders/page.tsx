"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { AnimatedSection } from "@/components/ui/animated-section";
import { cn } from "@/lib/utils";
import {
  Package,
  ArrowLeft,
  Clock,
  Download,
  Printer,
  FileText,
  ExternalLink,
  ShieldCheck,
  Star,
} from "lucide-react";

interface OrderItem {
  id: string;
  productId: string;
  price: number;
  product: {
    title: string;
    slug: string;
    thumbnail: string;
    type: string;
    zipUrl: string | null;
  };
}

interface MyReview {
  id: string;
  productId: string;
  rating: number;
  comment: string;
  verified: boolean;
}

interface ReviewTarget {
  productId: string;
  title: string;
  thumbnail: string;
}

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

interface Order {
  id: string;
  status: string;
  total: number;
  coupon: string | null;
  discount: number;
  createdAt: string;
  cfPaymentId?: string | null;
  items: OrderItem[];
  user?: {
    name: string | null;
    email: string | null;
  };
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeInvoice, setActiveInvoice] = useState<Order | null>(null);
  const [myReviews, setMyReviews] = useState<Record<string, MyReview>>({});
  const [reviewTarget, setReviewTarget] = useState<ReviewTarget | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/dashboard/orders");
    if (status === "authenticated") {
      fetch("/api/orders")
        .then((r) => r.json())
        .then((d) => {
          const allOrders = d.orders || [];
          setOrders(allOrders.filter((o: Order) => o.status === "paid" || o.status === "pending"));
          setLoading(false);
        })
        .catch(() => setLoading(false));

      fetch("/api/reviews?mine=1")
        .then((r) => (r.ok ? r.json() : { reviews: [] }))
        .then((d) => {
          const map: Record<string, MyReview> = {};
          (d.reviews || []).forEach((r: MyReview) => {
            map[r.productId] = r;
          });
          setMyReviews(map);
        })
        .catch(() => {});
    }
  }, [status, router]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openReviewModal = (item: OrderItem) => {
    const existing = myReviews[item.productId];
    setReviewTarget({
      productId: item.productId,
      title: item.product?.title || "Product",
      thumbnail: item.product?.thumbnail || "/placeholder.png",
    });
    setReviewRating(existing?.rating || 0);
    setReviewComment(existing?.comment || "");
    setHoverRating(0);
    setReviewError("");
  };

  const closeReviewModal = () => {
    setReviewTarget(null);
    setReviewRating(0);
    setReviewComment("");
    setReviewError("");
    setHoverRating(0);
  };

  const submitReview = async () => {
    if (!reviewTarget) return;

    if (reviewRating < 1) {
      setReviewError("Please select a star rating");
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError("Please write a short comment");
      return;
    }

    const existing = myReviews[reviewTarget.productId];
    setSubmittingReview(true);
    setReviewError("");

    try {
      const res = await fetch("/api/reviews", {
        method: existing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          existing
            ? { id: existing.id, rating: reviewRating, comment: reviewComment.trim() }
            : { productId: reviewTarget.productId, rating: reviewRating, comment: reviewComment.trim() }
        ),
      });
      const data = await res.json();

      if (res.ok && data.review) {
        const saved = data.review;
        setMyReviews((prev) => ({
          ...prev,
          [reviewTarget.productId]: {
            id: saved.id,
            productId: reviewTarget.productId,
            rating: saved.rating,
            comment: saved.comment,
            verified: saved.verified,
            createdAt: saved.createdAt,
          },
        }));
        showToast(existing ? "Review updated" : "Review submitted. Thanks for your feedback!");
        closeReviewModal();
      } else {
        setReviewError(data.error || "Failed to submit review");
      }
    } catch {
      setReviewError("Network error, please try again");
    }

    setSubmittingReview(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-[110] animate-fade-in-up">
          <div
            className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl",
              toast.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            )}
          >
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <section className="pt-24 pb-8">
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            {["admin", "super_admin"].includes(
              (session?.user as { role?: string } | null)?.role || ""
            ) && (
              <Link href="/admin/orders">
                <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/10 font-semibold h-8">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Orders Ledger
                </Button>
              </Link>
            )}
          </div>
          <AnimatedSection animation="fade-up">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground text-sm">
              View your transaction history and downloadable invoices.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Orders List */}
      <section className="pb-20">
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          {orders.length === 0 ? (
            <AnimatedSection animation="fade-up">
              <div className="text-center py-20 rounded-3xl border border-border/30 bg-card/20 p-8">
                <Package className="w-14 h-14 text-muted-foreground/20 mx-auto mb-4" />
                <h2 className="text-lg font-bold mb-2">No orders found</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  You haven&apos;t placed any orders yet. Discover our latest templates today.
                </p>
                <Link href="/templates">
                  <Button className="rounded-xl">Browse Marketplace</Button>
                </Link>
              </div>
            </AnimatedSection>
          ) : (
            <div className="space-y-6">
              {orders.map((order, i) => (
                <AnimatedSection key={order.id} animation="fade-up" delay={i * 50}>
                  <div className="rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl p-6 sm:p-7 shadow-lg space-y-5">
                    {/* Order Head */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/20">
                      <div>
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <span className="text-sm font-mono font-bold text-foreground">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <Badge
                            variant={
                              order.status === "paid"
                                ? "success"
                                : order.status === "pending"
                                ? "warning"
                                : "error"
                            }
                            className="text-[10px] px-2.5 py-0.5 capitalize"
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right mr-2">
                          <span className="text-xl font-extrabold text-foreground">
                            ₹{order.total}
                          </span>
                          {order.discount > 0 && (
                            <span className="text-xs text-emerald-400 block">
                              -₹{order.discount} promo
                            </span>
                          )}
                        </div>

                        {/* Invoice Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveInvoice(order)}
                          className="rounded-xl h-9 text-xs border-border/40 gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5 text-primary" />
                          <span>Tax Invoice</span>
                        </Button>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-3">
                      {order.items.map((item) => {
                        const myReview = myReviews[item.productId];
                        return (
                          <div
                            key={item.id}
                            className="p-4 rounded-2xl border border-border/20 bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <img
                                src={item.product?.thumbnail || "/placeholder.png"}
                                alt={item.product?.title || "Product"}
                                className="w-14 h-14 rounded-xl object-cover border border-border/30 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-foreground truncate">
                                  {item.product?.title || "Product"}
                                </p>
                                <span className="text-[10px] text-muted-foreground capitalize block mt-0.5">
                                  {item.product?.type || "Digital Product"}
                                </span>
                              </div>
                            </div>

                            {/* Downloads */}
                            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-0 border-border/20">
                              {/* Download Link */}
                              {order.status === "paid" ? (
                                item.product?.zipUrl ? (
                                  <a
                                    href={item.product.zipUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-fg hover:bg-primary-hover text-xs font-bold shadow-md shadow-primary/20 transition-all"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Download ZIP</span>
                                  </a>
                                ) : item.product?.slug ? (
                                  <Link
                                    href={`/templates/${item.product.slug}/download`}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-fg hover:bg-primary-hover text-xs font-bold shadow-md shadow-primary/20 transition-all"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Access Files</span>
                                  </Link>
                                ) : null
                              ) : (
                                <span className="text-xs text-amber-400">Payment pending</span>
                              )}

                              {/* Review */}
                              {order.status === "paid" &&
                                (myReview ? (
                                  <button
                                    type="button"
                                    onClick={() => openReviewModal(item)}
                                    title={
                                      myReview.verified
                                        ? "Verified purchase review — click to edit"
                                        : "Click to edit your review"
                                    }
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/20 text-xs font-bold transition-all"
                                  >
                                    <span className="flex items-center gap-0.5">
                                      {[1, 2, 3, 4, 5].map((v) => (
                                        <Star
                                          key={v}
                                          className={cn(
                                            "w-3.5 h-3.5",
                                            v <= myReview.rating
                                              ? "fill-amber-400 text-amber-400"
                                              : "text-muted-foreground/30"
                                          )}
                                        />
                                      ))}
                                    </span>
                                    <span>
                                      Your review
                                      {myReview.verified && " ✓"}
                                    </span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => openReviewModal(item)}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted hover:border-primary/40 text-xs font-bold text-foreground transition-all"
                                  >
                                    <Star className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Write a review</span>
                                  </button>
                                ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Tax Invoice Modal */}
      {activeInvoice && (
        <Modal
          isOpen={!!activeInvoice}
          onClose={() => setActiveInvoice(null)}
          title="Tax Invoice / Receipt"
        >
          <div className="p-4 sm:p-6 space-y-6 text-foreground print:p-0 print:text-black">
            {/* Invoice Header */}
            <div className="flex items-start justify-between border-b border-border/40 pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold tracking-tight text-foreground">
                  FlexStudioo Inc.
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Premium Digital Marketplace & Code Studio
                </p>
                <p className="text-xs text-muted-foreground">GSTIN: 27AABCF1234F1Z5</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-primary block">
                  TAX INVOICE
                </span>
                <span className="text-xs font-mono font-bold block mt-1">
                  INV-{new Date(activeInvoice.createdAt).getFullYear()}-{activeInvoice.id.slice(0, 6).toUpperCase()}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Date: {new Date(activeInvoice.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Billed To */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Billed To:
                </p>
                <p className="font-semibold text-foreground">
                  {activeInvoice.user?.name || session?.user?.name || "Valued Customer"}
                </p>
                <p className="text-muted-foreground">
                  {activeInvoice.user?.email || session?.user?.email || "customer@domain.com"}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Payment Details:
                </p>
                <p className="text-muted-foreground">Gateway: Cashfree Secure</p>
                <p className="text-muted-foreground">
                  Status: <span className="font-bold uppercase text-emerald-400">{activeInvoice.status}</span>
                </p>
                {activeInvoice.cfPaymentId && (
                  <p className="font-mono text-[11px] text-muted-foreground">
                    Ref: {activeInvoice.cfPaymentId}
                  </p>
                )}
              </div>
            </div>

            {/* Itemized Table */}
            <div className="border border-border/40 rounded-2xl overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/40 text-muted-foreground border-b border-border/30">
                  <tr>
                    <th className="py-2.5 px-3 text-left font-semibold">Description</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {activeInvoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 px-3 font-medium text-foreground">
                        {item.product?.title || "Purchased Product"}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-foreground">
                        ₹{item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Invoice Total Breakdown */}
            <div className="space-y-1.5 text-xs max-w-xs ml-auto pt-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal:</span>
                <span className="font-semibold text-foreground">
                  ₹{activeInvoice.items.reduce((s, i) => s + i.price, 0)}
                </span>
              </div>
              {activeInvoice.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount:</span>
                  <span>-₹{activeInvoice.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>GST (18% Included):</span>
                <span>₹{Math.round((activeInvoice.total * 0.18) / 1.18)}</span>
              </div>
              <div className="h-px bg-border/40 my-1" />
              <div className="flex justify-between text-base font-bold text-foreground">
                <span>Total Paid:</span>
                <span className="text-primary font-extrabold">₹{activeInvoice.total}</span>
              </div>
            </div>

            {/* Print & Close */}
            <div className="flex items-center justify-between pt-4 border-t border-border/30 print:hidden">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl gap-1.5"
                onClick={handlePrint}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </Button>
              <Button
                size="sm"
                className="rounded-xl px-5"
                onClick={() => setActiveInvoice(null)}
              >
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Review Modal */}
      {reviewTarget && (
        <Modal
          isOpen={!!reviewTarget}
          onClose={closeReviewModal}
          title={myReviews[reviewTarget.productId] ? "Edit your review" : "Write a review"}
        >
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <img
                src={reviewTarget.thumbnail}
                alt={reviewTarget.title}
                className="w-12 h-12 rounded-xl object-cover border border-border/30 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{reviewTarget.title}</p>
                <span className="text-[11px] text-muted-foreground">Verified purchase required</span>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Your rating
              </p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      setReviewRating(v);
                      setReviewError("");
                    }}
                    onMouseEnter={() => setHoverRating(v)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`${v} star${v > 1 ? "s" : ""}`}
                    className="p-0.5 transition-transform hover:scale-110"
                  >
                    <Star
                      className={cn(
                        "w-7 h-7 transition-colors",
                        (hoverRating ? v <= hoverRating : v <= reviewRating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      )}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-semibold text-muted-foreground">
                  {RATING_LABELS[hoverRating || reviewRating] || ""}
                </span>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Your comment
              </p>
              <textarea
                value={reviewComment}
                onChange={(e) => {
                  setReviewComment(e.target.value);
                  setReviewError("");
                }}
                rows={4}
                maxLength={1000}
                placeholder="Share your experience with this product..."
                className="w-full rounded-xl border border-border/40 bg-muted/20 px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 resize-none"
              />
              <p className="text-[11px] text-muted-foreground mt-1 text-right">
                {reviewComment.length}/1000
              </p>
            </div>

            {reviewError && <p className="text-xs font-medium text-red-400">{reviewError}</p>}

            <div className="flex justify-end gap-2 pt-3 border-t border-border/20">
              <Button variant="outline" size="sm" className="rounded-xl" onClick={closeReviewModal}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="rounded-xl px-5"
                loading={submittingReview}
                disabled={reviewRating < 1 || !reviewComment.trim()}
                onClick={submitReview}
              >
                {myReviews[reviewTarget.productId] ? "Update review" : "Submit review"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
