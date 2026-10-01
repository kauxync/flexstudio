"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Users,
  Shield,
  ShieldCheck,
  UserPlus,
  Trash2,
  UserCog,
  Search,
  CheckCircle2,
  XCircle,
  Mail,
  ShoppingBag,
  Star,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

interface UserItem {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  emailVerified: string | null;
  image: string | null;
  createdAt: string;
  _count?: {
    orders: number;
    reviews: number;
    cartItems: number;
    wishlistItems: number;
  };
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const currentRole = (session?.user as any)?.role;
  const isAdmin = currentRole === "admin" || currentRole === "super_admin";
  const isSuperAdmin = currentRole === "super_admin";

  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [roleModal, setRoleModal] = useState<UserItem | null>(null);
  const [deleteModal, setDeleteModal] = useState<UserItem | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch {
      showToast("Failed to fetch user accounts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    } else if (session !== undefined) {
      setLoading(false);
    }
  }, [isAdmin, session]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRoleChange = async (newRole: string) => {
    if (!roleModal) return;
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: roleModal.id, role: newRole }),
      });
      if (res.ok) {
        setUsers(users.map((u) => (u.id === roleModal.id ? { ...u, role: newRole } : u)));
        showToast(`Role updated for ${roleModal.name || roleModal.email}`);
        setRoleModal(null);
      } else {
        showToast("Failed to change user role", "error");
      }
    } catch {
      showToast("Error updating user role", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      const res = await fetch(`/api/users?id=${deleteModal.id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== deleteModal.id));
        showToast("User account removed");
        setDeleteModal(null);
      } else {
        const d = await res.json();
        showToast(d.error || "Failed to delete user", "error");
      }
    } catch {
      showToast("Error removing user account", "error");
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password) {
      showToast("All fields are required", "error");
      return;
    }
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (res.ok) {
        showToast("User account created successfully!");
        setAddModal(false);
        setNewUser({ name: "", email: "", password: "", role: "user" });
        fetchUsers();
      } else {
        const d = await res.json();
        showToast(d.error || "Failed to create user", "error");
      }
    } catch {
      showToast("Network error creating user", "error");
    }
  };

  if (!loading && !isAdmin) {
    return (
      <div className="p-8 rounded-3xl border border-warning/30 bg-card/60 backdrop-blur-xl text-center space-y-4 max-w-lg mx-auto mt-12">
        <div className="w-12 h-12 rounded-2xl bg-warning/10 text-warning flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-xl font-bold text-foreground">Administrator Privileges Required</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          User account management, credentials provisioning, and role assignment require administrative privileges.
        </p>
      </div>
    );
  }

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesSearch =
      searchQuery === "" ||
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const superAdminCount = users.filter((u) => u.role === "super_admin").length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const customerCount = users.filter((u) => u.role === "user").length;

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
            <span className="text-[11px] font-mono uppercase tracking-widest text-warning font-bold px-2 py-0.5 rounded-full bg-warning/10 border border-warning/20">
              Super Admin Access
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Users & Permissions
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage user accounts, assign admin roles, and audit customer interactions.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setAddModal(true)}
          className="gap-2 text-xs font-semibold shadow-md"
        >
          <UserPlus className="w-4 h-4" />
          Add Account
        </Button>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
          <span className="text-xs text-muted-foreground block">Total Accounts</span>
          <span className="text-xl font-bold text-foreground">{users.length}</span>
        </div>
        <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
          <span className="text-xs text-muted-foreground block">Super Admins</span>
          <span className="text-xl font-bold text-warning">{superAdminCount}</span>
        </div>
        <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
          <span className="text-xs text-muted-foreground block">Admins</span>
          <span className="text-xl font-bold text-gold">{adminCount}</span>
        </div>
        <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl">
          <span className="text-xs text-muted-foreground block">Customers</span>
          <span className="text-xl font-bold text-emerald-400">{customerCount}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search by user name or email address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 text-xs bg-background/60 border border-border/40 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>

        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/30 w-full md:w-auto overflow-x-auto">
          {["all", "super_admin", "admin", "user"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-all ${
                roleFilter === r
                  ? "bg-gold text-primary-fg font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r === "all" ? "All Roles" : r.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">
            <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading user directory...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground space-y-2">
            <Users className="w-12 h-12 mx-auto text-muted-foreground/30" />
            <p className="text-sm font-medium text-foreground">No accounts match search criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/30 bg-muted/20 text-muted-foreground/80">
                  <th className="py-3.5 px-4 font-semibold">User</th>
                  <th className="py-3.5 px-4 font-semibold">Role</th>
                  <th className="py-3.5 px-4 font-semibold">Purchases</th>
                  <th className="py-3.5 px-4 font-semibold">Joined Date</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filtered.map((user) => {
                  const roleBadge =
                    user.role === "super_admin"
                      ? "bg-warning/10 text-warning border-warning/20 font-bold"
                      : user.role === "admin"
                      ? "bg-gold/10 text-gold border-gold/20 font-semibold"
                      : "bg-muted text-muted-foreground border-border/30";

                  return (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gold/15 text-gold border border-gold/20 flex items-center justify-center font-bold text-xs shrink-0">
                            {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-foreground">{user.name || "Unnamed"}</span>
                              {user.emailVerified && (
                                <span title="Verified email">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-muted-foreground font-mono">{user.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] border capitalize ${roleBadge}`}>
                          {user.role.replace("_", " ")}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-muted-foreground">
                        <span className="font-medium text-foreground">{user._count?.orders || 0}</span> orders
                      </td>

                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setRoleModal(user)}
                            className="p-1.5 rounded-lg border border-border/30 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Change Role"
                          >
                            <UserCog className="w-3.5 h-3.5" />
                          </button>

                          {user.id !== (session?.user as any)?.id && (
                            <button
                              onClick={() => setDeleteModal(user)}
                              className="p-1.5 rounded-lg border border-border/30 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 transition-colors"
                              title="Delete Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
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

      {/* Role Change Modal */}
      {roleModal && (
        <Modal isOpen={!!roleModal} onClose={() => setRoleModal(null)} title="Update Account Role">
          <div className="space-y-4 pt-2 text-xs">
            <p className="text-muted-foreground">
              Select permissions for <span className="font-semibold text-foreground">{roleModal.name || roleModal.email}</span>:
            </p>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                { role: "user", label: "Customer", desc: "Browse, buy, review" },
                { role: "admin", label: "Admin", desc: "Catalog, orders, coupons" },
                { role: "super_admin", label: "Super Admin", desc: "Full root access" },
              ].map((opt) => (
                <button
                  key={opt.role}
                  onClick={() => handleRoleChange(opt.role)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    roleModal.role === opt.role
                      ? "bg-gold/15 border-gold/40 text-foreground ring-2 ring-gold/20"
                      : "bg-card/40 border-border/30 text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <p className="font-bold text-foreground text-xs">{opt.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setRoleModal(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add User Modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Create User Account">
        <div className="space-y-4 pt-2 text-xs">
          <div>
            <label className="font-semibold text-foreground block mb-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Alex Morgan"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
          </div>

          <div>
            <label className="font-semibold text-foreground block mb-1">Email Address</label>
            <input
              type="email"
              placeholder="alex@flexstudio.dev"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
          </div>

          <div>
            <label className="font-semibold text-foreground block mb-1">Temporary Password (min 8 chars)</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
          </div>

          <div>
            <label className="font-semibold text-foreground block mb-1">Assign Role</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full h-10 px-3 rounded-xl bg-background/60 border border-border/40 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
            >
              <option value="user">Customer (User)</option>
              <option value="admin">Administrator</option>
              <option value="super_admin">Super Administrator</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border/30">
            <Button variant="outline" size="sm" onClick={() => setAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddUser} className="font-semibold">
              Create Account
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete User Modal */}
      {deleteModal && (
        <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Account">
          <div className="space-y-4 pt-2 text-xs">
            <p className="text-muted-foreground leading-relaxed">
              Are you sure you want to permanently delete account for{" "}
              <span className="font-semibold text-foreground">{deleteModal.email}</span>?
              All past orders and activities will be unlinked.
            </p>
            <div className="flex justify-end gap-2 pt-4 border-t border-border/30">
              <Button variant="outline" size="sm" onClick={() => setDeleteModal(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleDelete} className="bg-rose-600 hover:bg-rose-700 text-white">
                Delete Account
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
