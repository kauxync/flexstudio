"use client";

import { useState, useEffect } from "react";
import {
  Tag,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Clock,
  Percent,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  minOrder: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  perUserLimit: number;
  startDate: string | null;
  endDate: string | null;
  active: boolean;
  _count?: { usages: number };
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minOrder: "",
    maxDiscount: "",
    usageLimit: "",
    perUserLimit: "1",
    startDate: "",
    endDate: "",
  });

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      const d = await res.json();
      setCoupons(d.coupons || []);
    } catch {
      showToast("Failed to load coupons", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggle = async (coupon: Coupon) => {
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: coupon.id, active: !coupon.active }),
      });
      if (res.ok) {
        setCoupons(coupons.map((c) => (c.id === coupon.id ? { ...c, active: !c.active } : c)));
        showToast(`Coupon ${coupon.code} ${!coupon.active ? "activated" : "deactivated"}`);
      }
    } catch {
      showToast("Failed to toggle coupon status", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setCoupons(coupons.filter((c) => c.id !== id));
        showToast("Coupon deleted successfully");
      }
    } catch {
      showToast("Failed to delete coupon", "error");
    }
  };

  const handleCreate = async () => {
    if (!form.code.trim() || !form.discountValue) {
      showToast("Code and discount value are required", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.trim().toUpperCase(),
          description: form.description || null,
          discountType: form.discountType,
          discountValue: parseFloat(form.discountValue),
          minOrder: form.minOrder ? parseFloat(form.minOrder) : 0,
          maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : null,
          usageLimit: form.usageLimit ? parseInt(form.usageLimit) : null,
          perUserLimit: form.perUserLimit ? parseInt(form.perUserLimit) : 1,
          startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
          endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
        }),
      });

      if (res.ok) {
        showToast("Coupon created successfully!");
        setShowModal(false);
        setForm({
          code: "",
          description: "",
          discountType: "percentage",
          discountValue: "",
          minOrder: "",
          maxDiscount: "",
          usageLimit: "",
          perUserLimit: "1",
          startDate: "",
          endDate: "",
        });
        fetchCoupons();
      } else {
        const d = await res.json();
        showToast(d.error || "Failed to create coupon", "error");
      }
    } catch {
      showToast("Error creating coupon", "error");
    } finally {
      setSaving(false);
    }
  };

  const activeCount = coupons.filter((c) => c.active).length;
  const totalUses = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);

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
              Promotions
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Discount Coupons
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Create promotional codes, set limits, and track redemption activity.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          className="gap-2 text-xs font-semibold shadow-md"
        >
          <Plus className="w-4 h-4" />
          Create Coupon
        </Button>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
          <span className="text-xs text-muted-foreground block">Active Coupons</span>
          <span className="text-xl font-bold text-emerald-400">{activeCount}</span>
        </div>
        <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
          <span className="text-xs text-muted-foreground block">Total Created</span>
          <span className="text-xl font-bold text-foreground">{coupons.length}</span>
        </div>
        <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
          <span className="text-xs text-muted-foreground block">Times Redeemed</span>
          <span className="text-xl font-bold text-amber-400">{totalUses}</span>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">
            <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading coupons...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground space-y-3">
            <Tag className="w-12 h-12 mx-auto text-muted-foreground/30" />
            <p className="text-base font-medium text-foreground">No coupons yet</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Create your first discount code to launch promotions.
            </p>
            <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
              Create Coupon
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/30 bg-muted/20 text-muted-foreground/80">
                  <th className="py-3.5 px-4 font-semibold">Code</th>
                  <th className="py-3.5 px-4 font-semibold">Discount</th>
                  <th className="py-3.5 px-4 font-semibold">Min Order</th>
                  <th className="py-3.5 px-4 font-semibold">Redemptions</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="py-3 px-4 font-mono font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <span className="text-gold bg-gold/10 px-2 py-0.5 rounded-lg border border-gold/20">
                          {c.code}
                        </span>
                        <button
                          onClick={() => copyCode(c.code)}
                          className="text-muted-foreground/50 hover:text-foreground p-0.5"
                          title="Copy code"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        {copiedCode === c.code && (
                          <span className="text-[10px] text-emerald-400 font-sans">copied</span>
                        )}
                      </div>
                      {c.description && (
                        <span className="text-[10px] text-muted-foreground font-sans block mt-1">
                          {c.description}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-semibold text-foreground">
                      {c.discountType === "percentage"
                        ? `${c.discountValue}% OFF`
                        : `₹${c.discountValue} OFF`}
                      {c.maxDiscount && (
                        <span className="text-[10px] text-muted-foreground block">
                          up to ₹{c.maxDiscount}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-muted-foreground">
                      {c.minOrder > 0 ? `₹${c.minOrder}` : "No minimum"}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-foreground">{c.usedCount}</span>
                      <span className="text-muted-foreground">
                        {c.usageLimit ? ` / ${c.usageLimit}` : " / ∞"}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggle(c)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border transition-all ${
                          c.active
                            ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                            : "bg-muted text-muted-foreground border-border/40"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${c.active ? "bg-emerald-400" : "bg-muted-foreground"}`} />
                        {c.active ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 rounded-lg border border-border/30 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 transition-colors"
                        title="Delete coupon"
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

      {/* Create Coupon Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Promo Coupon">
        <div className="space-y-4 pt-2 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-foreground block mb-1">Coupon Code *</label>
              <input
                type="text"
                placeholder="FLEX20"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-gold/30 uppercase"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Discount Type</label>
              <select
                value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-foreground block mb-1">
                Value {form.discountType === "percentage" ? "(%)" : "(₹)"} *
              </label>
              <input
                type="number"
                placeholder={form.discountType === "percentage" ? "20" : "500"}
                value={form.discountValue}
                onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Min Order (₹)</label>
              <input
                type="number"
                placeholder="0"
                value={form.minOrder}
                onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Max Cap (₹)</label>
              <input
                type="number"
                placeholder="Optional"
                value={form.maxDiscount}
                onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-foreground block mb-1">Total Usage Limit</label>
              <input
                type="number"
                placeholder="Unlimited if blank"
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Per User Limit</label>
              <input
                type="number"
                value={form.perUserLimit}
                onChange={(e) => setForm({ ...form, perUserLimit: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-foreground block mb-1">Description / Campaign Note</label>
            <input
              type="text"
              placeholder="e.g. Black Friday launch special discount"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-border/30">
            <Button variant="outline" size="sm" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreate}
              disabled={saving}
              className="font-semibold"
            >
              {saving ? "Creating..." : "Save Coupon"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
