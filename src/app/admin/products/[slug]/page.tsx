"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Star,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export default function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    shortDesc: "",
    price: 0,
    originalPrice: 0,
    type: "template",
    category: "Dashboard",
    technologies: "",
    thumbnail: "",
    zipUrl: "",
    demoUrl: "",
    version: "1.0.0",
    status: "active",
    featured: false,
    isNew: false,
    isBestseller: false,
  });

  const [metrics, setMetrics] = useState({
    downloadCount: 0,
    rating: 0,
    reviewCount: 0,
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        const p = data.product;
        if (!p) {
          router.push("/admin/products");
          return;
        }
        setForm({
          title: p.title || "",
          slug: p.slug || "",
          description: p.description || "",
          shortDesc: p.shortDesc || "",
          price: p.price || 0,
          originalPrice: p.originalPrice || 0,
          type: p.type || "template",
          category: p.category || "Dashboard",
          technologies: Array.isArray(p.technologies) ? p.technologies.join(", ") : "",
          thumbnail: p.thumbnail || "",
          zipUrl: p.zipUrl || "",
          demoUrl: p.demoUrl || "",
          version: p.version || "1.0.0",
          status: p.status || "active",
          featured: Boolean(p.featured),
          isNew: Boolean(p.isNew),
          isBestseller: Boolean(p.isBestseller),
        });
        setMetrics({
          downloadCount: p.downloadCount || 0,
          rating: p.rating || 0,
          reviewCount: p.reviewCount || 0,
        });
        setLoading(false);
      })
      .catch(() => {
        showToast("Error loading product", "error");
        setLoading(false);
      });
  }, [slug, router]);

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      showToast("Title and Slug are required", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        technologies: form.technologies
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      };

      const res = await fetch(`/api/products/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast("Product updated successfully!");
        if (form.slug !== slug) {
          router.replace(`/admin/products/${form.slug}`);
        }
      } else {
        const d = await res.json();
        showToast(d.error || "Failed to update", "error");
      }
    } catch {
      showToast("Network error updating product", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${slug}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Product deleted");
        setTimeout(() => router.push("/admin/products"), 800);
      } else {
        showToast("Failed to delete product", "error");
      }
    } catch {
      showToast("Error deleting product", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-muted-foreground animate-pulse">
        <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs">Loading product details...</p>
      </div>
    );
  }

  const liveStoreHref = form.type === "template" ? `/templates/${slug}` : `/source-code/${slug}`;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
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
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground truncate max-w-lg">
              {form.title || "Edit Product"}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${
                form.status === "active"
                  ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                  : "bg-amber-400/10 text-amber-400 border-amber-400/20"
              }`}
            >
              {form.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={liveStoreHref} target="_blank">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Eye className="w-3.5 h-3.5" />
              Preview in Store
            </Button>
          </Link>
          <button
            onClick={() => setDeleteModal(true)}
            className="p-2 rounded-xl border border-border/40 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 transition-colors"
            title="Delete Product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="gap-2 font-semibold shadow-md text-xs"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Performance Bar */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
        <div className="text-center">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Downloads</span>
          <span className="text-lg font-bold text-foreground">{metrics.downloadCount}</span>
        </div>
        <div className="text-center">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Rating</span>
          <span className="text-lg font-bold text-amber-400 flex items-center justify-center gap-1">
            <Star className="w-4 h-4 fill-amber-400" />
            {metrics.rating} ({metrics.reviewCount})
          </span>
        </div>
        <div className="text-center">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Gross Yield</span>
          <span className="text-lg font-bold text-emerald-400">
            ₹{(form.price * metrics.downloadCount).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4">
            <h2 className="font-serif text-base font-bold text-foreground">General Details</h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1.5">Product Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1.5">Slug URL *</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1.5">Short Summary *</label>
                <input
                  type="text"
                  value={form.shortDesc}
                  onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1.5">Description (Markdown)</label>
                <textarea
                  rows={8}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4">
            <h2 className="font-serif text-base font-bold text-foreground">Delivery & Demo Links</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1.5">Download File URL (.zip)</label>
                <input
                  type="text"
                  value={form.zipUrl}
                  onChange={(e) => setForm({ ...form, zipUrl: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1.5">Demo URL</label>
                <input
                  type="text"
                  value={form.demoUrl}
                  onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Options (1 col) */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4 text-xs">
            <h2 className="font-serif text-base font-bold text-foreground">Pricing & Status</h2>

            <div>
              <label className="font-semibold text-foreground block mb-1.5">Publish Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 capitalize"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
              >
                <option value="template">Web Template</option>
                <option value="source-code">Source Code</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
              >
                <option value="Dashboard">Dashboard</option>
                <option value="Landing Page">Landing Page</option>
                <option value="E-Commerce">E-Commerce</option>
                <option value="Portfolio">Portfolio</option>
                <option value="Mobile App">Mobile App</option>
                <option value="SaaS">SaaS</option>
                <option value="Agency">Agency</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground block mb-1.5">Price (₹)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground block mb-1.5">Original (₹)</label>
                <input
                  type="number"
                  value={form.originalPrice}
                  onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1.5">Version</label>
              <input
                type="text"
                value={form.version}
                onChange={(e) => setForm({ ...form, version: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4 text-xs">
            <h2 className="font-serif text-base font-bold text-foreground">Media & Technologies</h2>

            <div>
              <label className="font-semibold text-foreground block mb-1.5">Thumbnail URL</label>
              <input
                type="text"
                value={form.thumbnail}
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>

            {form.thumbnail && (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-border/40 bg-muted">
                <img src={form.thumbnail} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div>
              <label className="font-semibold text-foreground block mb-1.5">Technologies</label>
              <input
                type="text"
                value={form.technologies}
                onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>

            <div className="pt-2 border-t border-border/20 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-gold focus:ring-gold/30"
                />
                <span className="font-medium text-foreground">Featured Item</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isBestseller}
                  onChange={(e) => setForm({ ...form, isBestseller: e.target.checked })}
                  className="w-4 h-4 rounded text-gold focus:ring-gold/30"
                />
                <span className="font-medium text-foreground">Bestseller Badge</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Product">
        <div className="space-y-4 pt-2">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-foreground">{form.title}</span>? This action cannot be reversed.
          </p>
          <div className="flex justify-end gap-2.5 pt-4 border-t border-border/30">
            <Button variant="outline" size="sm" onClick={() => setDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {deleting ? "Deleting..." : "Delete Permanently"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
