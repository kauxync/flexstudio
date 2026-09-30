"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Download,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  Calendar,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch("/api/admin/newsletter");
      const d = await res.json();
      setSubscribers(d.subscribers || []);
    } catch {
      showToast("Failed to load newsletter subscribers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    try {
      const res = await fetch(`/api/admin/newsletter?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSubscribers(subscribers.filter((s) => s.id !== id));
        showToast("Subscriber removed");
      } else {
        showToast("Failed to remove subscriber", "error");
      }
    } catch {
      showToast("Network error deleting subscriber", "error");
    }
  };

  const exportCSV = () => {
    if (subscribers.length === 0) {
      showToast("No subscribers to export", "error");
      return;
    }
    const headers = "ID,Email,SubscribedAt\n";
    const rows = subscribers
      .map((s) => `"${s.id}","${s.email}","${s.subscribedAt}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `flexstudio_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV file exported successfully!");
  };

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              Audience
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Newsletter Subscribers
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            View mailing list audience, export subscriber records, and monitor lead capture.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={exportCSV}
          className="gap-2 text-xs font-semibold shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export CSV ({subscribers.length})
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
          <span className="text-xs text-muted-foreground block">Active Mailing List</span>
          <span className="text-xl font-bold text-foreground">{subscribers.length}</span>
        </div>
        <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
          <span className="text-xs text-muted-foreground block">Capture Status</span>
          <span className="text-xl font-bold text-emerald-400">Opt-in Active</span>
        </div>
        <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
          <span className="text-xs text-muted-foreground block">Delivery Channel</span>
          <span className="text-xl font-bold text-gold">Marketing Broadcasts</span>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search subscribers by email address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 text-xs bg-background/60 border border-border/40 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">
            <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading mailing list...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground space-y-2">
            <Mail className="w-12 h-12 mx-auto text-muted-foreground/30" />
            <p className="text-sm font-medium text-foreground">No subscribers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/30 bg-muted/20 text-muted-foreground/80">
                  <th className="py-3.5 px-4 font-semibold">Subscriber Email</th>
                  <th className="py-3.5 px-4 font-semibold">Subscription Date</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="py-3 px-4 font-mono font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>{s.email}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(s.subscribedAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                        Subscribed
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 rounded-lg border border-border/30 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 transition-colors"
                        title="Remove subscriber"
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
