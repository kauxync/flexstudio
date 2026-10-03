"use client";

import { use, useState, useEffect, useRef } from "react";
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
  Upload,
  Image as ImageIcon,
  FileArchive,
  Copy,
  Check,
  RefreshCw,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { generateTemplateCode } from "@/lib/template-code";

export default function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // 8-character Template Code
  const [templateCode, setTemplateCode] = useState(() => generateTemplateCode());
  const [copiedCode, setCopiedCode] = useState(false);

  // Upload states
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
    price: 0,
    originalPrice: 0,
    type: "template",
    category: "Dashboard",
    technologies: "",
    thumbnail: "",
    images: [] as string[],
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
    setTimeout(() => setToast(null), 3500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(templateCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
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

        // Derive consistent 8-char code from product id or generate
        if (p.id) {
          const derivedCode = p.id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase();
          if (derivedCode.length === 8) setTemplateCode(derivedCode);
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
          images: Array.isArray(p.images) ? p.images : [],
          zipUrl: p.zipUrl || "",
          demoUrl: p.demoUrl || "",
          version: p.version || "1.0.0",
          status: p.status || "active",
          featured: Boolean(p.featured),
          isNew: Boolean(p.isNew),
          isBestseller: Boolean(p.isBestseller),
        });

        if (p.zipUrl) {
          setZipMeta({ name: "Uploaded Archive", size: "Cloud Storage" });
        }

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

  // Upload handler to Hostinger via Next.js proxy
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

  // Upload banner
  const handleBannerSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    try {
      const data = await handleFileUpload(file, "banner");
      setForm((prev) => ({ ...prev, thumbnail: data.url }));
      showToast("Banner image updated on dataflexstudio CDN!");
    } catch (err: any) {
      showToast(err.message || "Failed to upload banner image", "error");
    } finally {
      setUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  // Upload gallery screenshots
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
      showToast(`Uploaded ${newUrls.length} screenshot(s) to CDN!`);
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

  // Upload zip
  const handleZipSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    setUploadingZip(true);
    try {
      const data = await handleFileUpload(file, "zip");
      setForm((prev) => ({ ...prev, zipUrl: data.url }));
      setZipMeta({ name: file.name, size: `${sizeInMb} MB` });
      showToast(`Template archive uploaded (${sizeInMb} MB)!`);
    } catch (err: any) {
      showToast(err.message || "Failed to upload template ZIP", "error");
    } finally {
      setUploadingZip(false);
      if (zipInputRef.current) zipInputRef.current.value = "";
    }
  };

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
          router.push(`/admin/products/${form.slug}`);
        }
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to update product", "error");
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
        showToast("Product deleted or archived successfully");
        router.push("/admin/products");
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to delete product", "error");
      }
    } catch {
      showToast("Error deleting product", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-muted-foreground">
        <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs">Loading product details...</p>
      </div>
    );
  }

  const previewHref =
    form.type === "template" ? `/templates/${form.slug}` : `/source-code/${form.slug}`;

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
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Edit: {form.title || "Product"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-mono">
            /templates/{form.slug}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={previewHref}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border/40 bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Store Preview</span>
          </Link>
          <Button
            variant="outline"
            onClick={() => setDeleteModal(true)}
            className="text-rose-400 border-rose-500/20 hover:bg-rose-500/10 text-xs"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="gap-2 font-semibold shadow-md text-xs"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
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
              <span className="text-muted-foreground font-medium">Template Storage Code:</span>
              <span className="font-mono font-bold text-foreground text-sm tracking-widest bg-background/80 px-2 py-0.5 rounded-lg border border-border/40">
                {templateCode}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Hostinger CDN Path: <span className="font-mono text-foreground">dataflexstudio.kauxync.in/uploads/{templateCode}/</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyCode}
          className="px-2.5 py-1.5 rounded-lg bg-card border border-border/40 text-muted-foreground hover:text-foreground text-[11px] font-medium flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedCode ? "Copied" : "Copy Code"}</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl">
        <div className="text-center">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Downloads</span>
          <span className="text-lg font-bold text-foreground">{metrics.downloadCount}</span>
        </div>
        <div className="text-center border-x border-border/30">
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
                  className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 font-mono"
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

          {/* Template ZIP Archive Upload */}
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4">
            <div>
              <h2 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
                <FileArchive className="w-5 h-5 text-gold" />
                Template Archive File (.ZIP)
              </h2>
              <p className="text-xs text-muted-foreground">
                Managed securely on Hostinger Business Cloud at <span className="font-mono text-gold">dataflexstudio.kauxync.in</span>
              </p>
            </div>

            <input
              ref={zipInputRef}
              type="file"
              accept=".zip,.tar,.gz,.7z,.rar"
              className="hidden"
              onChange={handleZipSelect}
            />

            <div className="space-y-3 text-xs">
              {form.zipUrl ? (
                <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate max-w-sm">
                        {zipMeta?.name || "Active Template Archive"}
                      </p>
                      <p className="font-mono text-[11px] text-muted-foreground truncate max-w-md mt-0.5">
                        {form.zipUrl}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => zipInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg border border-border/40 bg-card text-foreground hover:bg-muted font-semibold text-xs"
                    >
                      Replace File
                    </button>
                    <a
                      href={form.zipUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-border/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                      title="Test Download"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, zipUrl: "" }));
                        setZipMeta(null);
                      }}
                      className="p-1.5 rounded-lg border border-border/40 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400"
                      title="Clear file"
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
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold border border-gold/20 flex items-center justify-center mx-auto">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-foreground">Click to upload template .ZIP</p>
                      <p className="text-[11px] text-muted-foreground">Up to 500 MB</p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="font-semibold text-foreground block mb-1">Direct Download URL:</label>
                <input
                  type="text"
                  value={form.zipUrl}
                  onChange={(e) => setForm({ ...form, zipUrl: e.target.value })}
                  placeholder="https://dataflexstudio.kauxync.in/uploads/.../template.zip"
                  className="w-full h-9 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Live Demo Preview URL:</label>
                <input
                  type="text"
                  value={form.demoUrl}
                  onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                  placeholder="https://preview.flexstudio.dev"
                  className="w-full h-9 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
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
                  Showcase / Showup Images (Gallery)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Feature screenshots and detailed preview views for customer browsing.
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
                <span>Add Images</span>
              </Button>
            </div>

            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleGallerySelect}
            />

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
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/40"
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
                className="p-6 rounded-2xl border-2 border-dashed border-border/40 hover:border-gold/50 bg-background/40 hover:bg-gold/5 transition-all text-center cursor-pointer text-xs text-muted-foreground"
              >
                {uploadingGallery ? (
                  <div className="py-2 flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gold" />
                    <span>Uploading screenshots to CDN...</span>
                  </div>
                ) : (
                  <span>Click here to upload showcase gallery screenshots</span>
                )}
              </div>
            )}
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

          {/* Banner Image Upload Section */}
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4 text-xs">
            <h2 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-gold" />
              Template Banner Image *
            </h2>

            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerSelect}
            />

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
                    <span>Uploading banner...</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Upload className="w-6 h-6 text-gold mx-auto" />
                    <p className="text-xs font-semibold text-foreground">Click to upload banner</p>
                    <p className="text-[10px] text-muted-foreground">PNG, WebP, JPG up to 15 MB</p>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="font-semibold text-foreground block mb-1">Direct URL Input:</label>
              <input
                type="text"
                value={form.thumbnail}
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                className="w-full h-8 px-2.5 rounded-lg bg-background/60 border border-border/40 text-foreground font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1.5">Technologies (comma separated)</label>
              <input
                type="text"
                value={form.technologies}
                onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>
          </div>

          {/* Visibility Badges */}
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-3 text-xs">
            <h2 className="font-serif text-base font-bold text-foreground">Visibility & Tags</h2>

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
              <span className="text-foreground font-medium">Feature on Homepage</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isBestseller}
                onChange={(e) => setForm({ ...form, isBestseller: e.target.checked })}
                className="w-4 h-4 rounded text-gold focus:ring-gold/30"
              />
              <span className="text-foreground font-medium">Mark as Bestseller</span>
            </label>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4 pt-2 text-xs">
          <p className="text-muted-foreground">
            Are you sure you want to delete <span className="font-bold text-foreground">{form.title}</span>? If customers have already purchased this product, it will be safely archived to preserve customer access.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              {deleting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
