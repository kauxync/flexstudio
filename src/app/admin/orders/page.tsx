"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  Clock,
  User,
  DollarSign,
  Package,
  Copy,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  CreditCard,
  Tag,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface OrderItem {
  id: string;
  price: number;
  license: string;
  product: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string;
    type: string;
    price: number;
  };
}

interface Order {
  id: string;
  status: string;
  total: number;
  coupon: string | null;
  discount: number;
  cfOrderId?: string | null;
  cfPaymentId?: string | null;
  createdAt: string;
  items: OrderItem[];
  user?: {
    id: string;
    name: string | null;
    email: string | null;
    phone?: string | null;
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const d = await res.json();
      setOrders(d.orders || []);
    } catch {
      showToast("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const { order: updated } = await res.json();
        setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: updated.status } : o)));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: updated.status });
        }
        showToast(`Order status updated to ${newStatus}`);
      } else {
        showToast("Failed to update order status", "error");
      }
    } catch {
      showToast("Network error updating status", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filtered = orders.filter((order) => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesSearch =
      searchQuery === "" ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items?.some((i) => i.product?.title?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const paidOrders = orders.filter((o) => o.status === "paid");
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const failedOrders = orders.filter((o) => o.status === "failed");
  const totalRevenue = paidOrders.reduce((acc, o) => acc + o.total, 0);

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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-gold font-bold px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20">
              Transactions
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Customer Orders
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Review sales transactions, payment statuses, and invoice records.
          </p>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
          <span className="text-xs text-muted-foreground block">Gross Revenue</span>
          <span className="text-xl font-bold text-amber-400">₹{totalRevenue.toLocaleString("en-IN")}</span>
        </div>
        <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
          <span className="text-xs text-muted-foreground block">Total Invoices</span>
          <span className="text-xl font-bold text-foreground">{orders.length}</span>
        </div>
        <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
          <span className="text-xs text-muted-foreground block">Completed (Paid)</span>
          <span className="text-xl font-bold text-emerald-400">{paidOrders.length}</span>
        </div>
        <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
          <span className="text-xs text-muted-foreground block">Pending Payment</span>
          <span className="text-xl font-bold text-amber-400">{pendingOrders.length}</span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search by order ID, customer name, email, or product title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 text-xs bg-background/60 border border-border/40 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>

        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/30 w-full md:w-auto overflow-x-auto">
          {["all", "paid", "pending", "failed", "refunded"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-all ${
                filterStatus === s
                  ? "bg-gold text-primary-fg font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">
            <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading orders ledger...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground space-y-3">
            <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground/30" />
            <p className="text-base font-medium text-foreground">No orders found</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              No orders matched your current search filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/30 bg-muted/20 text-muted-foreground/80">
                  <th className="py-3.5 px-4 font-semibold">Order ID</th>
                  <th className="py-3.5 px-4 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">Items</th>
                  <th className="py-3.5 px-4 font-semibold">Total Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filtered.map((order) => {
                  const statusBadgeColor =
                    order.status === "paid"
                      ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                      : order.status === "pending"
                      ? "bg-amber-400/10 text-amber-400 border-amber-400/20"
                      : order.status === "refunded"
                      ? "bg-blue-400/10 text-blue-400 border-blue-400/20"
                      : "bg-rose-400/10 text-rose-400 border-rose-400/20";

                  return (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="py-3 px-4 font-mono font-medium text-foreground">
                        <div className="flex items-center gap-1.5">
                          <span>#{order.id.slice(0, 10)}</span>
                          <button
                            onClick={() => copyToClipboard(order.id, order.id)}
                            className="text-muted-foreground/50 hover:text-foreground p-0.5"
                            title="Copy full order ID"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          {copiedId === order.id && (
                            <span className="text-[10px] text-emerald-400 font-mono">copied</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-semibold text-foreground truncate max-w-[160px]">
                          {order.user?.name || "Guest Customer"}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate max-w-[160px]">
                          {order.user?.email || "No email"}
                        </p>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {order.items.slice(0, 3).map((item) => (
                            <img
                              key={item.id}
                              src={item.product?.thumbnail || "/placeholder.png"}
                              alt={item.product?.title || "Product"}
                              title={item.product?.title || "Product"}
                              className="w-7 h-7 rounded-lg object-cover border border-border/40"
                            />
                          ))}
                          {order.items.length > 3 && (
                            <span className="text-[10px] text-muted-foreground font-mono">
                              +{order.items.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-foreground">₹{order.total}</div>
                        {order.discount > 0 && (
                          <span className="text-[10px] text-emerald-400">
                            -₹{order.discount} ({order.coupon})
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusBadgeColor} capitalize`}>
                          {order.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                          className="h-8 px-2.5 text-xs gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder.id}`}
        >
          <div className="space-y-6 pt-2 text-xs">
            {/* Status & Update Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-muted/30 border border-border/30">
              <div>
                <span className="text-muted-foreground block text-[11px]">Current Status:</span>
                <span className="font-bold text-foreground capitalize text-sm">
                  {selectedOrder.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Change to:</span>
                {["paid", "pending", "refunded", "failed"].map((st) => (
                  <button
                    key={st}
                    disabled={updatingStatus || selectedOrder.status === st}
                    onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize border transition-all ${
                      selectedOrder.status === st
                        ? "bg-gold/20 text-gold border-gold/40 cursor-default"
                        : "bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground border-border/40"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Details */}
            <div className="p-4 rounded-2xl border border-border/30 bg-card/40 space-y-2">
              <h3 className="font-serif font-bold text-sm text-foreground">Customer Information</h3>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider">Name</span>
                  <span className="text-foreground font-medium">{selectedOrder.user?.name || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider">Email</span>
                  <span className="text-foreground font-medium">{selectedOrder.user?.email || "N/A"}</span>
                </div>
                {selectedOrder.user?.phone && (
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider">Phone</span>
                    <span className="text-foreground font-medium">{selectedOrder.user.phone}</span>
                  </div>
                )}
                <div>
                  <span className="block text-[10px] uppercase tracking-wider">Placed On</span>
                  <span className="text-foreground font-medium">
                    {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-sm text-foreground">Purchased Items</h3>
              <div className="divide-y divide-border/20 rounded-2xl border border-border/30 bg-card/40 overflow-hidden">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product?.thumbnail || "/placeholder.png"}
                        alt={item.product?.title || "Product"}
                        className="w-10 h-10 rounded-lg object-cover border border-border/30"
                      />
                      <div>
                        <p className="font-semibold text-foreground">{item.product?.title || "Unknown Product"}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">
                          {item.product?.type || "Item"} · {item.license} license
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-foreground">₹{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 rounded-2xl border border-border/30 bg-muted/20 space-y-1.5">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{selectedOrder.items.reduce((s, i) => s + i.price, 0)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount ({selectedOrder.coupon})</span>
                  <span>-₹{selectedOrder.discount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-border/30 flex justify-between font-bold text-sm text-foreground">
                <span>Total Settled</span>
                <span>₹{selectedOrder.total}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedOrder(null)}>
                Close Invoice
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
