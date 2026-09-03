"use client";

import AOS from "aos";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export default function AppProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      once: false,
      duration: 800,
      easing: "ease-in-out",
      disable: () =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => AOS.refreshHard());
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return <SessionProvider>{children}</SessionProvider>;
}
