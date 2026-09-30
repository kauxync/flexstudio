import type { Metadata } from "next";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";

export const metadata: Metadata = {
  title: {
    default: "Admin Console | FlexStudio",
    template: "%s | Admin Console",
  },
  description: "Executive control panel for FlexStudio products, orders, coupons, and users.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </AdminGuard>
  );
}
