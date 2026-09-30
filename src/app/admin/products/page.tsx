"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  Star,
  Download,
  CheckCircle2,
  XCircle,
  Eye,
  SlidersHorizontal,
  RefreshCw,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: string;
  type: string;
  rating: number;
  downloadCount: number;
  status: string;
  featured: boolean;
  thumbnail: string;
  shortDesc: string;
  technologies: string[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "template" | "source-code">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft" | "archived">("all");
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products?status=all");
      const d = await res.json();
      setProducts(d.products || []);
    } catch {
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${deleteProduct.slug}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== deleteProduct.id));
        showToast("Product deleted successfully");
        setDeleteProduct(null);
      } else {
        showToast("Failed to delete product", "error");
      }
    } catch {
      showToast("Error deleting product", "error");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = products.filter((p) => {
    const matchesType = typeFilter === "all" || p.type === typeFilter;
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const activeCount = products.filter((p) => p.status === "active").length;
  const draftCount = products.filter((p) => p.status === "draft").length;
  const templatesCount = products.filter((p) => p.type === "template").length;
  const codeCount = products.filter((p) => p.type === "source-code").length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
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

      {/* Header with Title & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-gold font-bold px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20">
              Catalog Management
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Digital Products
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage web templates, source code kits, versions, pricing, and live listings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/admin/products/new">
            <Button variant="primary" className="gap-2 text-xs font-semibold shadow-md">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
          <span className="text-xs text-muted-foreground block">Total Listed</span>
          <span className="text-xl font-bold text-foreground">{products.length}</span>
        </div>
        <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
          <span className="text-xs text-muted-foreground block">Active for Sale</span>
          <span className="text-xl font-bold text-emerald-400">{activeCount}</span>
        </div>
        <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
          <span className="text-xs text-muted-foreground block">Drafts</span>
          <span className="text-xl font-bold text-amber-400">{draftCount}</span>
        </div>
        <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
          <span className="text-xs text-muted-foreground block">Templates / Code</span>
          <span className="text-xl font-bold text-foreground">{templatesCount} / {codeCount}</span>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search by title, slug, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 text-xs bg-background/60 border border-border/40 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/30 w-full md:w-auto overflow-x-auto">
          {(["all", "template", "source-code"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-all ${
                typeFilter === type
                  ? "bg-gold text-primary-fg font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {type === "all" ? "All Types" : type.replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/30 w-full md:w-auto overflow-x-auto">
          {(["all", "active", "draft", "archived"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-all ${
                statusFilter === status
                  ? "bg-gold text-primary-fg font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">
            <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading product catalog...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground space-y-3">
            <Package className="w-12 h-12 mx-auto text-muted-foreground/30" />
            <p className="text-base font-medium text-foreground">No products match your criteria</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try adjusting your search query, type, or status filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setTypeFilter("all");
                setStatusFilter("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/30 bg-muted/20 text-muted-foreground/80">
                  <th className="py-3.5 px-4 font-semibold">Product</th>
                  <th className="py-3.5 px-4 font-semibold">Type</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Price</th>
                  <th className="py-3.5 px-4 font-semibold">Downloads</th>
                  <th className="py-3.5 px-4 font-semibold">Rating</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filtered.map((product) => {
                  const previewHref =
                    product.type === "template"
                      ? `/templates/${product.slug}`
                      : `/source-code/${product.slug}`;

                  return (
                    <tr key={product.id} className="hover:bg-muted/30 transition-colors group">
                      {/* Product Thumbnail & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="w-12 h-12 rounded-xl object-cover border border-border/30 shrink-0 bg-muted"
                          />
                          <div className="min-w-0 max-w-[240px]">
                            <span className="font-semibold text-foreground block truncate group-hover:text-gold transition-colors">
                              {product.title}
                            </span>
                            <span className="font-mono text-[10px] text-muted-foreground block truncate">
                              /{product.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${
                            product.type === "template"
                              ? "bg-blue-400/10 text-blue-400 border-blue-400/20"
                              : "bg-purple-400/10 text-purple-400 border-purple-400/20"
                          }`}
                        >
                          {product.type.replace("-", " ")}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-muted-foreground">{product.category}</td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-foreground">₹{product.price}</div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-[10px] text-muted-foreground/60 line-through">
                            ₹{product.originalPrice}
                          </div>
                        )}
                      </td>

                      {/* Downloads */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-foreground">{product.downloadCount}</span>
                      </td>

                      {/* Rating */}
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1 font-medium">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          {product.rating}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${
                            product.status === "active"
                              ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                              : product.status === "draft"
                              ? "bg-amber-400/10 text-amber-400 border-amber-400/20"
                              : "bg-muted text-muted-foreground border-border/40"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={previewHref}
                            target="_blank"
                            className="p-1.5 rounded-lg border border-border/30 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Preview in Store"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          <Link
                            href={`/admin/products/${product.slug}`}
                            className="p-1.5 rounded-lg border border-border/30 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => setDeleteProduct(product)}
                            className="p-1.5 rounded-lg border border-border/30 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        title="Delete Product"
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to permanently delete{" "}
            <span className="font-semibold text-foreground">{deleteProduct?.title}</span>?
            This will remove all associated database references and cannot be undone.
          </p>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-border/30">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteProduct(null)}
              disabled={deleting}
            >
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
