import type { ReactNode } from "react";
import AdminLayout from "@/components/Layouts/Admin/AdminLayout";

export default function Layout({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
