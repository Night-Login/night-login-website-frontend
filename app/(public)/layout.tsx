import type { ReactNode } from "react";
import Navbar from "@/components/Layouts/Navbar/Navbar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
