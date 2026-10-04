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
  Lock,
  Trash2,
  ExternalLink,
  Plus,
  Loader2,
  UploadCloud,
  Download,
  Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateTemplateCode } from "@/lib/template-code";
import {
  injectLighthouseScores,
  LighthouseScores,
  DEFAULT_LIGHTHOUSE_SCORES,
} from "@/lib/product-metadata";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { cn } from "@/lib/utils";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // 8-character Unique Template Code for dataflexstudio.kauxync.in directory structure
  const [templateCode, setTemplateCode] = useState(() => generateTemplateCode());
  const [copiedCode, setCopiedCode] = useState(false);

  // Lighthouse benchmark state & Markdown preview tab
  const [lighthouse, setLighthouse] = useState<LighthouseScores>(DEFAULT_LIGHTHOUSE_SCORES);
  const [descTab, setDescTab] = useState<"write" | "preview">("write");

  // Upload state trackers
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [isDraggingBanner, setIsDraggingBanner] = useState(false);

  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);
  const [galleryUploadProgress, setGalleryUploadProgress] = useState("");
  const [manualImageUrl, setManualImageUrl] = useState("");

  const [uploadingZip, setUploadingZip] = useState(false);
  const [isDraggingZip, setIsDraggingZip] = useState(false);
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

  // Base upload function to Next.js API (which forwards to dataflexstudio.kauxync.in)
  const handleFileUpload = async (file: File, type: "banner" | "gallery" | "zip") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("template_code", templateCode);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
      throw new Error(data?.error || `Upload failed with HTTP ${res.status}`);
    }

    return data;
  };

  // -------------------------------------------------------------
  // BANNER UPLOAD & DRAG/DROP
  // -------------------------------------------------------------
  const uploadBannerFile = async (file: File) => {
    if (!file.type.startsWith("image/") && !/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name)) {
      showToast("Please upload a valid image file (PNG, WebP, JPG)", "error");
      return;
    }

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

  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadBannerFile(file);
  };

  const handleBannerDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingBanner(true);
  };

  const handleBannerDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingBanner(false);
  };

  const handleBannerDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingBanner(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadBannerFile(file);
  };

  // -------------------------------------------------------------
  // SHOWCASE / GALLERY UPLOAD & DRAG/DROP
  // -------------------------------------------------------------
  const uploadGalleryFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    const imageFiles = files.filter(
      (f) => f.type.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f.name)
    );

    if (imageFiles.length === 0) {
      showToast("Please drop or select valid image files (PNG, WebP, JPG, SVG)", "error");
      return;
    }

    setUploadingGallery(true);
    setGalleryUploadProgress(`Uploading ${imageFiles.length} showcase screenshot(s)...`);

    try {
      // Parallel upload with Promise.allSettled
      const results = await Promise.allSettled(
        imageFiles.map(async (file) => {
          const res = await handleFileUpload(file, "gallery");
          return res.url as string;
        })
      );

      const successfulUrls: string[] = [];
      let failCount = 0;

      results.forEach((r) => {
        if (r.status === "fulfilled" && r.value) {
          successfulUrls.push(r.value);
        } else {
          failCount++;
        }
      });

      if (successfulUrls.length > 0) {
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, ...successfulUrls],
        }));
        showToast(`Uploaded ${successfulUrls.length} showcase image(s) to dataflexstudio CDN!`);
      }

      if (failCount > 0) {
        showToast(`${failCount} image(s) failed to upload`, "error");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to upload gallery images", "error");
    } finally {
      setUploadingGallery(false);
      setGalleryUploadProgress("");
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadGalleryFiles(e.target.files);
    }
  };

  const handleGalleryDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingGallery(true);
  };

  const handleGalleryDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingGallery(false);
  };

  const handleGalleryDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingGallery(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadGalleryFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleAddManualImageUrl = () => {
    if (!manualImageUrl.trim()) return;
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, manualImageUrl.trim()],
    }));
    setManualImageUrl("");
    showToast("Added image link to showcase gallery");
  };

  // -------------------------------------------------------------
  // TEMPLATE ZIP UPLOAD & DRAG/DROP
  // -------------------------------------------------------------
  const uploadZipFile = async (file: File) => {
    const validArchive = /\.(zip|tar|gz|7z|rar)$/i.test(file.name);
    if (!validArchive) {
      showToast("Please upload an archive file (.zip, .tar.gz, .7z, .rar)", "error");
      return;
    }

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

  const handleZipSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadZipFile(file);
  };

  const handleZipDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingZip(true);
  };

  const handleZipDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingZip(false);
  };

  const handleZipDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingZip(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadZipFile(file);
  };

  // Save / Publish
  const handleSave = async (status: "active" | "draft") => {
    if (!form.title.trim() || !form.slug.trim() || !form.price) {
      showToast("Please provide Title, Slug, and Price", "error");
      return;
    }

    setSaving(true);
    try {
      const fullDescription = injectLighthouseScores(form.description, lighthouse);
      const payload = {
        ...form,
        description: fullDescription,
        storageCode: templateCode,
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
            Drag & drop files or browse. All assets are automatically stored and served from{" "}
            <span className="font-mono text-gold font-semibold">dataflexstudio.kauxync.in</span>.
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
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground font-medium">Permanent Storage Code:</span>
              <span className="font-mono font-bold text-foreground text-sm tracking-widest bg-background/80 px-2 py-0.5 rounded-lg border border-border/40">
                {templateCode}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gold/15 text-gold text-[10px] font-semibold border border-gold/30">
                <Lock className="w-3 h-3" />
                Unchangeable
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 break-all">
              Hostinger CDN Path:{" "}
              <span className="font-mono text-foreground">
                dataflexstudio.kauxync.in/uploads/{templateCode}/
              </span>
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-foreground">Full Markdown Description</label>
                  <div className="flex items-center gap-1 bg-background/80 p-0.5 rounded-lg border border-border/40 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setDescTab("write")}
                      className={cn(
                        "px-2.5 py-0.5 rounded-md font-medium transition-colors",
                        descTab === "write"
                          ? "bg-primary text-primary-fg shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Write Markdown
                    </button>
                    <button
                      type="button"
                      onClick={() => setDescTab("preview")}
                      className={cn(
                        "px-2.5 py-0.5 rounded-md font-medium transition-colors",
                        descTab === "preview"
                          ? "bg-primary text-primary-fg shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Preview Formatted
                    </button>
                  </div>
                </div>

                {descTab === "write" ? (
                  <textarea
                    rows={8}
                    placeholder="Comprehensive description of product features, tech stack, documentation, setup guide using Markdown (## Headings, - bullet points, **bold**, etc.)..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full p-3 rounded-xl bg-background/60 border border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 font-mono text-[11px]"
                  />
                ) : (
                  <div className="min-h-[160px] p-4 rounded-xl bg-background/40 border border-border/40 max-h-96 overflow-y-auto">
                    {form.description.trim() ? (
                      <MarkdownContent content={form.description} />
                    ) : (
                      <p className="text-muted-foreground italic text-xs">Nothing to preview yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lighthouse Audited Benchmark Configuration */}
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif text-base font-bold text-foreground">
                    Lighthouse Audited Benchmark
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Configure Google Lighthouse audit scores displayed on the template page
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={lighthouse.enabled}
                  onChange={(e) => setLighthouse({ ...lighthouse, enabled: e.target.checked })}
                  className="rounded border-border/50 text-primary focus:ring-primary w-4 h-4"
                />
                <span className="text-xs font-semibold text-foreground">
                  {lighthouse.enabled ? "Enabled" : "Disabled"}
                </span>
              </label>
            </div>

            {lighthouse.enabled ? (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Performance (0-100)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={lighthouse.performance}
                      onChange={(e) =>
                        setLighthouse({
                          ...lighthouse,
                          performance: Math.min(100, Math.max(0, Number(e.target.value))),
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground font-mono font-bold text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Accessibility (0-100)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={lighthouse.accessibility}
                      onChange={(e) =>
                        setLighthouse({
                          ...lighthouse,
                          accessibility: Math.min(100, Math.max(0, Number(e.target.value))),
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground font-mono font-bold text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Best Practices (0-100)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={lighthouse.bestPractices}
                      onChange={(e) =>
                        setLighthouse({
                          ...lighthouse,
                          bestPractices: Math.min(100, Math.max(0, Number(e.target.value))),
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground font-mono font-bold text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground block mb-1">SEO (0-100)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={lighthouse.seo}
                      onChange={(e) =>
                        setLighthouse({
                          ...lighthouse,
                          seo: Math.min(100, Math.max(0, Number(e.target.value))),
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground font-mono font-bold text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">First Contentful Paint</label>
                    <input
                      type="text"
                      placeholder="0.4s"
                      value={lighthouse.fcp || ""}
                      onChange={(e) => setLighthouse({ ...lighthouse, fcp: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg bg-background/60 border border-border/40 text-foreground font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Largest Contentful Paint</label>
                    <input
                      type="text"
                      placeholder="0.8s"
                      value={lighthouse.lcp || ""}
                      onChange={(e) => setLighthouse({ ...lighthouse, lcp: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg bg-background/60 border border-border/40 text-foreground font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Cumulative Layout Shift</label>
                    <input
                      type="text"
                      placeholder="0.00"
                      value={lighthouse.cls || ""}
                      onChange={(e) => setLighthouse({ ...lighthouse, cls: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg bg-background/60 border border-border/40 text-foreground font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* Score meters preview */}
                <div className="p-3 rounded-2xl border border-border/30 bg-background/40 flex items-center justify-around gap-2 text-center">
                  {[
                    { label: "Performance", score: lighthouse.performance },
                    { label: "Accessibility", score: lighthouse.accessibility },
                    { label: "Best Practices", score: lighthouse.bestPractices },
                    { label: "SEO", score: lighthouse.seo },
                  ].map((item) => {
                    const colorClass =
                      item.score >= 90
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                        : item.score >= 50
                        ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                        : "text-rose-400 bg-rose-500/10 border-rose-500/20";
                    return (
                      <div key={item.label} className="flex flex-col items-center">
                        <span
                          className={cn(
                            "w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs border mb-1",
                            colorClass
                          )}
                        >
                          {item.score}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                Lighthouse Audited Benchmark is currently disabled for this template. Check the box above to enable.
              </p>
            )}
          </div>

          {/* Template ZIP File Upload Section */}
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4">
            <div>
              <h2 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
                <FileArchive className="w-5 h-5 text-gold" />
                Template Download File (.ZIP Archive)
              </h2>
              <p className="text-xs text-muted-foreground">
                Drag and drop your project `.zip` or `.tar.gz` archive. Stored on Hostinger CDN and delivered to paying customers.
              </p>
            </div>

            {/* Hidden file input */}
            <input
              ref={zipInputRef}
              type="file"
              accept=".zip,.tar,.gz,.7z,.rar"
              className="hidden"
              onChange={handleZipSelect}
            />

            {/* Upload & Drag/Drop Box */}
            <div className="space-y-3">
              {form.zipUrl ? (
                <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate max-w-sm">
                        {zipMeta?.name || "Uploaded Template Archive"}
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
                    <a
                      href={form.zipUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-border/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                      title="Download Test"
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
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => !uploadingZip && zipInputRef.current?.click()}
                  onDragOver={handleZipDragOver}
                  onDragEnter={handleZipDragOver}
                  onDragLeave={handleZipDragLeave}
                  onDrop={handleZipDrop}
                  className={`p-6 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer ${
                    isDraggingZip
                      ? "border-gold bg-gold/15 scale-[1.01] shadow-lg shadow-gold/10"
                      : "border-border/50 hover:border-gold/50 bg-background/40 hover:bg-gold/5"
                  } ${uploadingZip ? "opacity-60 pointer-events-none" : ""}`}
                >
                  {uploadingZip ? (
                    <div className="space-y-2 py-4">
                      <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" />
                      <p className="text-xs font-semibold text-foreground">
                        Uploading archive to dataflexstudio.kauxync.in...
                      </p>
                      <p className="text-[11px] text-muted-foreground">Please do not refresh</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold border border-gold/20 flex items-center justify-center mx-auto">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-foreground">
                        {isDraggingZip ? "Drop .ZIP Archive Here!" : "Drag & Drop Template .ZIP here, or click to browse"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Supports .zip, .tar.gz up to 500 MB · Saves in Hostinger folder{" "}
                        <span className="font-mono text-gold font-bold">{templateCode}</span>
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

          {/* Showcase / Gallery Images Upload Section */}
          <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-gold" />
                  Showcase / Showup Images (Gallery Previews)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Drag & drop multiple screenshot images or browse from your computer.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => galleryInputRef.current?.click()}
                disabled={uploadingGallery}
                className="gap-1.5 text-xs h-8 self-start sm:self-auto shrink-0"
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

            {/* Large Drag & Drop Zone */}
            <div
              onClick={() => !uploadingGallery && galleryInputRef.current?.click()}
              onDragOver={handleGalleryDragOver}
              onDragEnter={handleGalleryDragOver}
              onDragLeave={handleGalleryDragLeave}
              onDrop={handleGalleryDrop}
              className={`p-6 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer ${
                isDraggingGallery
                  ? "border-gold bg-gold/15 scale-[1.01] shadow-lg shadow-gold/10"
                  : "border-border/50 hover:border-gold/50 bg-background/40 hover:bg-gold/5"
              }`}
            >
              {uploadingGallery ? (
                <div className="py-4 space-y-2">
                  <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-foreground">
                    {galleryUploadProgress || "Uploading showcase images to Hostinger..."}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Uploading screenshots concurrently</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold border border-gold/20 flex items-center justify-center mx-auto">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-foreground">
                    {isDraggingGallery
                      ? "Drop Screenshot Images Here!"
                      : "Drag & Drop Multiple Showcase Screenshots Here"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    PNG, WebP, JPG, SVG · Drop 1 or multiple images at once
                  </p>
                </div>
              )}
            </div>

            {/* Showcase Image Grid with Preview & Delete */}
            {form.images.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    Uploaded Gallery ({form.images.length} screenshot{form.images.length !== 1 ? "s" : ""})
                  </span>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, images: [] }))}
                    className="text-rose-400 hover:underline text-[11px]"
                  >
                    Remove all
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {form.images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-xl overflow-hidden border border-border/40 bg-muted/20 aspect-video shadow-sm"
                    >
                      <img
                        src={imgUrl}
                        alt={`Showcase ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 pointer-coarse:opacity-100 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <a
                          href={imgUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-card text-foreground hover:bg-muted"
                          title="Open Fullscreen"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/40"
                          title="Remove image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-mono text-white/90">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}

                  {/* Add more drop button inside grid */}
                  <div
                    onClick={() => !uploadingGallery && galleryInputRef.current?.click()}
                    onDragOver={handleGalleryDragOver}
                    onDragEnter={handleGalleryDragOver}
                    onDragLeave={handleGalleryDragLeave}
                    onDrop={handleGalleryDrop}
                    className="rounded-xl border border-dashed border-border/50 hover:border-gold/50 bg-background/30 hover:bg-gold/5 aspect-video flex flex-col items-center justify-center gap-1 cursor-pointer text-muted-foreground hover:text-foreground transition-all"
                  >
                    <Plus className="w-5 h-5 text-gold" />
                    <span className="text-[11px] font-medium">+ Add More</span>
                  </div>
                </div>
              </div>
            )}

            {/* Manual Image URL Adder */}
            <div className="pt-2 border-t border-border/20">
              <label className="font-semibold text-foreground block mb-1 text-xs">
                Or paste direct image URL to add to gallery:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://dataflexstudio.kauxync.in/uploads/.../screenshot.png"
                  value={manualImageUrl}
                  onChange={(e) => setManualImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddManualImageUrl())}
                  className="flex-1 h-9 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground placeholder:text-muted-foreground/50 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddManualImageUrl}
                  disabled={!manualImageUrl.trim()}
                  className="h-9 text-xs shrink-0"
                >
                  Add to Gallery
                </Button>
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
                <option value="HTML">HTML</option>
                <option value="Tailwind">Tailwind</option>
                <option value="React">React</option>
                <option value="Next.js">Next.js</option>
                <option value="Dashboard">Dashboard</option>
                <option value="Landing Page">Landing Page</option>
                <option value="E-Commerce">E-Commerce</option>
                <option value="Portfolio">Portfolio</option>
                <option value="SaaS">SaaS</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Vue">Vue</option>
                <option value="PHP">PHP</option>
                <option value="Laravel">Laravel</option>
                <option value="WordPress">WordPress</option>
                <option value="Shopify">Shopify</option>
                <option value="AI">AI</option>
                <option value="Agency">Agency</option>
                <option value="CRM">CRM</option>
                <option value="Education">Education</option>
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
              Main cover photo displayed on marketplace cards and catalog banners.
            </p>

            {/* Hidden file input for banner */}
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerSelect}
            />

            {/* Banner preview or upload / drag-and-drop button */}
            {form.thumbnail ? (
              <div className="space-y-2">
                <div className="relative aspect-video rounded-xl overflow-hidden border border-border/40 bg-muted group shadow-sm">
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
                onDragOver={handleBannerDragOver}
                onDragEnter={handleBannerDragOver}
                onDragLeave={handleBannerDragLeave}
                onDrop={handleBannerDrop}
                className={`p-6 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer ${
                  isDraggingBanner
                    ? "border-gold bg-gold/15 scale-[1.01] shadow-lg shadow-gold/10"
                    : "border-border/40 hover:border-gold/50 bg-background/40 hover:bg-gold/5"
                }`}
              >
                {uploadingBanner ? (
                  <div className="py-2 text-xs text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gold" />
                    <span>Uploading banner to dataflexstudio CDN...</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Upload className="w-6 h-6 text-gold mx-auto" />
                    <p className="text-xs font-semibold text-foreground">
                      {isDraggingBanner ? "Drop Banner Image Here!" : "Drag & Drop or Click to Upload Banner"}
                    </p>
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
