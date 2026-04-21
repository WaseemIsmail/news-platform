import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin Dashboard | Contextra",
  description: "Manage Contextra articles, comments, categories, and users.",
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}