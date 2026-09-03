import type { ReactNode } from "react";
import DashboardLayout from "@/components/Layouts/DashboardLayout";

export default function Layout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
