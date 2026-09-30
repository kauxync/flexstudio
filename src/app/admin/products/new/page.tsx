"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Eye,
  Package,
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  FileCode,
  DollarSign,
  Link2,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    shortDesc: "",
    price: 999,
    originalPrice: 1499,
    type: "template",
    category: "Dashboard",
    technologies: "Next.js, TypeScript, Tailwind CSS",
    thumbnail: "",
    zipUrl: "",
    demoUrl: "",
    version: "1.0.0",
    featured: false,
    isNew: true,
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleTitleChange = (val: string) => {
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: autoSlug,
    }));
  };

  const handleSave = async (status: "active" | "draft") => {
    if (!form.title.trim() || !form.slug.trim() || !form.price) {
      showToast("Please provide Title, Slug, and Price", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        status,
        technologies: form.technologies
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast("Product created successfully!");
        setTimeout(() => router.push("/admin/products"), 1000);
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to create product", "error");
      }
    } catch {
      showToast("Network error creating product", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Toast Notification */}
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
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Create New Product
          </h1>
          <p className="text-xs text-muted-foreground">
            Add a new digital asset to the FlexStudio marketplace.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave("draft")}
            disabled={saving}
          >
            Save as Draft
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleSave("active")}
            disabled={saving}
            className="gap-2 font-semibold shadow-md"
          >
            <Save className="w-4 h-4" />
            {saving ? "Publishing..." : "Publish Product"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4">
            <h2 className="font-serif text-base font-bold text-foreground">General Information</h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1.5">Product Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Nexus - Modern SaaS Dashboard Kit"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1.5">URL Slug *</label>
                <div className="flex items-center rounded-xl bg-background/60 border border-border/40 overflow-hidden focus-within:ring-2 focus-within:ring-gold/30">
                  <span className="px-3 text-muted-foreground/60 select-none bg-muted/20 border-r border-border/30 h-10 flex items-center">
                    /templates/
                  </span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full h-10 px-3 bg-transparent text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1.5">Short Summary *</label>
                <input
                  type="text"
                  placeholder="A concise one-line highlight for cards and previews"
                  value={form.shortDesc}
                  onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1.5">Full Markdown Description</label>
                <textarea
                  rows={8}
                  placeholder="Comprehensive description of the product features, tech stack, documentation, setup guide..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-background/60 border border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Files and Delivery URLs */}
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4">
            <h2 className="font-serif text-base font-bold text-foreground">Delivery & Demo Links</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1.5">Download File URL (.zip)</label>
                <input
                  type="text"
                  placeholder="https://.../download.zip or cloud storage link"
                  value={form.zipUrl}
                  onChange={(e) => setForm({ ...form, zipUrl: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1.5">Live Interactive Demo URL</label>
                <input
                  type="text"
                  placeholder="https://preview.flexstudio.dev/demo"
                  value={form.demoUrl}
                  onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings (1 col) */}
        <div className="space-y-6">
          {/* Classification & Pricing */}
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4 text-xs">
            <h2 className="font-serif text-base font-bold text-foreground">Classification & Pricing</h2>

            <div>
              <label className="font-semibold text-foreground block mb-1.5">Product Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
              >
                <option value="template">Web Template</option>
                <option value="source-code">Source Code / Boilerplate</option>
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
                <label className="font-semibold text-foreground block mb-1.5">Price (₹) *</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1.5">Original Price (₹)</label>
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

          {/* Media & Artwork */}
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4 text-xs">
            <h2 className="font-serif text-base font-bold text-foreground">Media & Artwork</h2>

            <div>
              <label className="font-semibold text-foreground block mb-1.5">Thumbnail Image URL</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={form.thumbnail}
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>

            {form.thumbnail && (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-border/40 bg-muted">
                <img src={form.thumbnail} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div>
              <label className="font-semibold text-foreground block mb-1.5">Technologies (comma separated)</label>
              <input
                type="text"
                placeholder="React, Next.js, Tailwind, Prisma"
                value={form.technologies}
                onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>
          </div>

          {/* Badges & Flags */}
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-3 text-xs">
            <h2 className="font-serif text-base font-bold text-foreground">Marketing Badges</h2>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 rounded text-gold focus:ring-gold/30"
              />
              <span className="font-medium text-foreground">Feature on Homepage</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isNew}
                onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                className="w-4 h-4 rounded text-gold focus:ring-gold/30"
              />
              <span className="font-medium text-foreground">Mark as "New Release"</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
