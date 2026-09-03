import type { Metadata } from "next";
import type { ReactNode } from "react";
import AppProviders from "@/components/Contexts/AppProviders";
import "aos/dist/aos.css";
import "swiper/css";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Night Login",
  description: "Night Login, a computer society under KMTETI FT UGM.",
  icons: { icon: "/assets/images/Logo.png" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AppProviders>
          <div className="font-poppins">{children}</div>
        </AppProviders>
      </body>
    </html>
  );
}
