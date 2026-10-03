"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Package,
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  FileCode,
  DollarSign,
  Link2,
  Tag,
  Upload,
  Image as ImageIcon,
  FileArchive,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  ExternalLink,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateTemplateCode } from "@/lib/template-code";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // 8-character Unique Template Code for dataflexstudio.kauxync.in directory structure
  const [templateCode, setTemplateCode] = useState(() => generateTemplateCode());
  const [copiedCode, setCopiedCode] = useState(false);

  // Upload state trackers
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingZip, setUploadingZip] = useState(false);
  const [zipMeta, setZipMeta] = useState<{ name: string; size: string } | null>(null);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

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
    images: [] as string[],
    zipUrl: "",
    demoUrl: "",
    version: "1.0.0",
    featured: false,
    isNew: true,
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(templateCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRegenerateCode = () => {
    const newCode = generateTemplateCode();
    setTemplateCode(newCode);
    showToast(`Generated new 8-character template code: ${newCode}`);
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

  // Upload handler for single file (banner or zip)
  const handleFileUpload = async (file: File, type: "banner" | "gallery" | "zip") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("template_code", templateCode);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || `Upload failed with status ${res.status}`);
    }

    return data;
  };

  // Upload banner image
  const handleBannerSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    try {
      const data = await handleFileUpload(file, "banner");
      setForm((prev) => ({ ...prev, thumbnail: data.url }));
      showToast("Banner image uploaded successfully to dataflexstudio CDN!");
    } catch (err: any) {
      showToast(err.message || "Failed to upload banner image", "error");
    } finally {
      setUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  // Upload showcase / gallery images (multiple)
  const handleGallerySelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const data = await handleFileUpload(files[i], "gallery");
        newUrls.push(data.url);
      }
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...newUrls],
      }));
      showToast(`Uploaded ${newUrls.length} showcase image(s) to CDN!`);
    } catch (err: any) {
      showToast(err.message || "Failed to upload gallery images", "error");
    } finally {
      setUploadingGallery(false);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // Upload template .zip file
  const handleZipSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    setUploadingZip(true);
    try {
      const data = await handleFileUpload(file, "zip");
      setForm((prev) => ({ ...prev, zipUrl: data.url }));
      setZipMeta({ name: file.name, size: `${sizeInMb} MB` });
      showToast(`Template archive uploaded successfully (${sizeInMb} MB)!`);
    } catch (err: any) {
      showToast(err.message || "Failed to upload template ZIP", "error");
    } finally {
      setUploadingZip(false);
      if (zipInputRef.current) zipInputRef.current.value = "";
    }
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
        showToast("Product published successfully!");
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
    <div className="space-y-8 animate-fade-in pb-16">
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
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{toast.message}</span>
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
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products Catalog
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-gold font-bold px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20">
              New Listing
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
            Create Digital Product
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Upload files directly to <span className="font-mono text-gold font-semibold">dataflexstudio.kauxync.in</span> and publish to the marketplace.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="gap-2 text-xs"
          >
            Save as Draft
          </Button>
          <Button
            onClick={() => handleSave("active")}
            disabled={saving}
            className="gap-2 font-semibold shadow-md text-xs"
          >
            <Save className="w-4 h-4" />
            {saving ? "Publishing..." : "Publish Product"}
          </Button>
        </div>
      </div>

      {/* 8-Character Unique Template Code Bar */}
      <div className="p-4 rounded-2xl border border-gold/30 bg-gold/5 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold/15 text-gold border border-gold/30 flex items-center justify-center font-bold font-mono">
            ID
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium">Unique Template Code:</span>
              <span className="font-mono font-bold text-foreground text-sm tracking-widest bg-background/80 px-2 py-0.5 rounded-lg border border-border/40">
                {templateCode}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Files will be stored in <span className="font-mono text-foreground">dataflexstudio.kauxync.in/uploads/{templateCode}/</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyCode}
            className="px-2.5 py-1.5 rounded-lg bg-card border border-border/40 text-muted-foreground hover:text-foreground text-[11px] font-medium flex items-center gap-1.5 transition-colors"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? "Copied" : "Copy Code"}</span>
          </button>
          <button
            type="button"
            onClick={handleRegenerateCode}
            className="px-2.5 py-1.5 rounded-lg bg-card border border-border/40 text-muted-foreground hover:text-foreground text-[11px] font-medium flex items-center gap-1.5 transition-colors"
            title="Generate a new 8-character code"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>
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
                  placeholder="Comprehensive description of product features, tech stack, documentation, setup guide..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-background/60 border border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Template ZIP File Upload Section */}
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
                  <FileArchive className="w-5 h-5 text-gold" />
                  Template Download Files (.ZIP Archive)
                </h2>
                <p className="text-xs text-muted-foreground">
                  The actual source code file stored safely on Hostinger. Customers download this after verified purchase.
                </p>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={zipInputRef}
              type="file"
              accept=".zip,.tar,.gz,.7z,.rar"
              className="hidden"
              onChange={handleZipSelect}
            />

            {/* Upload Box */}
            <div className="space-y-3">
              {form.zipUrl ? (
                <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate max-w-sm">
                        {zipMeta?.name || "Uploaded Archive"}
                      </p>
                      <p className="font-mono text-[11px] text-muted-foreground truncate max-w-md mt-0.5">
                        {form.zipUrl}
                      </p>
                      {zipMeta?.size && (
                        <span className="text-[10px] text-emerald-400 font-bold">{zipMeta.size}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => zipInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg border border-border/40 bg-card text-foreground hover:bg-muted text-xs font-semibold"
                    >
                      Replace File
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, zipUrl: "" }));
                        setZipMeta(null);
                      }}
                      className="p-1.5 rounded-lg border border-border/40 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => !uploadingZip && zipInputRef.current?.click()}
                  className={`p-6 rounded-2xl border-2 border-dashed border-border/50 hover:border-gold/50 bg-background/40 hover:bg-gold/5 transition-all text-center cursor-pointer ${
                    uploadingZip ? "opacity-60 pointer-events-none" : ""
                  }`}
                >
                  {uploadingZip ? (
                    <div className="space-y-2 py-4">
                      <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" />
                      <p className="text-xs font-semibold text-foreground">Uploading archive to dataflexstudio.kauxync.in...</p>
                      <p className="text-[11px] text-muted-foreground">Please do not refresh the page</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold border border-gold/20 flex items-center justify-center mx-auto">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-foreground">
                        Click or drag to upload Template .ZIP file
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Supports .zip, .tar.gz up to 500 MB · Stored in Hostinger directory <span className="font-mono text-gold">{templateCode}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Direct Link Fallback */}
              <div>
                <label className="font-semibold text-foreground block mb-1 text-xs">
                  Or Direct File URL (Manual Input):
                </label>
                <input
                  type="text"
                  placeholder="https://dataflexstudio.kauxync.in/uploads/.../template.zip"
                  value={form.zipUrl}
                  onChange={(e) => setForm({ ...form, zipUrl: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground placeholder:text-muted-foreground/50 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1 text-xs">
                  Live Interactive Demo URL:
                </label>
                <input
                  type="text"
                  placeholder="https://demo.kauxync.in or live preview link"
                  value={form.demoUrl}
                  onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground placeholder:text-muted-foreground/50 text-xs focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>
            </div>
          </div>

          {/* Showcase / Gallery Images Upload */}
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-gold" />
                  Showcase / Showup Images (Gallery Previews)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Additional screenshots, feature showcases, and detail shots for customers to browse.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => galleryInputRef.current?.click()}
                disabled={uploadingGallery}
                className="gap-1.5 text-xs h-8"
              >
                {uploadingGallery ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                <span>Add Screenshots</span>
              </Button>
            </div>

            {/* Hidden gallery file input */}
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleGallerySelect}
            />

            {/* Showcase Image Grid */}
            {form.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {form.images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-border/40 bg-muted/20 aspect-video"
                  >
                    <img src={imgUrl} alt={`Showcase ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <a
                        href={imgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-card text-foreground hover:bg-muted"
                        title="View Full Size"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/40"
                        title="Remove Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                onClick={() => !uploadingGallery && galleryInputRef.current?.click()}
                className="p-6 rounded-2xl border-2 border-dashed border-border/40 hover:border-gold/50 bg-background/40 hover:bg-gold/5 transition-all text-center cursor-pointer"
              >
                {uploadingGallery ? (
                  <div className="py-2 text-xs text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gold" />
                    <span>Uploading showcase images...</span>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Click here to select multiple preview images (PNG, WebP, JPG)
                  </p>
                )}
              </div>
            )}
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

          {/* Banner & Artwork Upload Section */}
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4 text-xs">
            <h2 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-gold" />
              Template Banner Image *
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Main preview thumbnail displayed across catalog cards and banners.
            </p>

            {/* Hidden file input for banner */}
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerSelect}
            />

            {/* Banner preview or upload button */}
            {form.thumbnail ? (
              <div className="space-y-2">
                <div className="relative aspect-video rounded-xl overflow-hidden border border-border/40 bg-muted group">
                  <img src={form.thumbnail} alt="Banner Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => bannerInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-card text-foreground hover:bg-muted font-semibold text-xs"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, thumbnail: "" }))}
                      className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="font-mono text-[10px] text-muted-foreground truncate">{form.thumbnail}</p>
              </div>
            ) : (
              <div
                onClick={() => !uploadingBanner && bannerInputRef.current?.click()}
                className="p-6 rounded-2xl border-2 border-dashed border-border/40 hover:border-gold/50 bg-background/40 hover:bg-gold/5 transition-all text-center cursor-pointer"
              >
                {uploadingBanner ? (
                  <div className="py-2 text-xs text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gold" />
                    <span>Uploading banner to CDN...</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Upload className="w-6 h-6 text-gold mx-auto" />
                    <p className="text-xs font-semibold text-foreground">Click to upload banner image</p>
                    <p className="text-[10px] text-muted-foreground">PNG, WebP, JPG up to 15 MB</p>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="font-semibold text-foreground block mb-1">Or paste URL manually:</label>
              <input
                type="text"
                placeholder="https://dataflexstudio.kauxync.in/uploads/.../banner.png"
                value={form.thumbnail}
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                className="w-full h-8 px-2.5 rounded-lg bg-background/60 border border-border/40 text-foreground placeholder:text-muted-foreground/50 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1.5">Technologies (comma separated)</label>
              <input
                type="text"
                placeholder="React, Next.js, Tailwind, TypeScript"
                value={form.technologies}
                onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>
          </div>

          {/* Badges & Flags */}
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-3 text-xs">
            <h2 className="font-serif text-base font-bold text-foreground">Badges & Visibility</h2>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isNew}
                onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                className="w-4 h-4 rounded text-gold focus:ring-gold/30"
              />
              <span className="text-foreground font-medium">Mark as &quot;New Release&quot;</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 rounded text-gold focus:ring-gold/30"
              />
              <span className="text-foreground font-medium">Feature on Homepage Bento Grid</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
