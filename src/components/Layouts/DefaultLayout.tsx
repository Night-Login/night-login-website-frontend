import type { ReactNode } from "react";
import Footer from "@/components/Elements/Footer";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content with padding for fixed navbar */}
      <main className="grow pt-[76px] sm:pt-[86px]">{children}</main>

      <Footer />
    </div>
  );
};
