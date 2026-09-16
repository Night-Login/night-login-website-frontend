"use client";

import DashboardLogo from "@public/assets/images/DasboardLogo.png";
import ArrowL from "@public/assets/images/icons/ArrowLeft.png";
import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useState } from "react";
import type { StaticImageData } from "next/image";

import Home from "@public/assets/images/icons/Home.png";
import HomeActive from "@public/assets/images/icons/HomeActive.png";
import Request from "@public/assets/images/icons/Request.png";
import RequestActive from "@public/assets/images/icons/RequestActive.png";
import History from "@public/assets/images/icons/History.png";
import HistoryActive from "@public/assets/images/icons/HistoryActive.png";
import Guide from "@public/assets/images/icons/Guide.png";
import GuideActive from "@public/assets/images/icons/GuideActive.png";
import Faq from "@public/assets/images/icons/Faq.png";
import FaqActive from "@public/assets/images/icons/FaqActive.png";
import Logout from "@public/assets/images/icons/Logout.png";

import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const r = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  
  const isLeader = session?.user?.role === "leader";
  
  return (
    <main className="flex min-h-screen">
      <aside className="shrink-0 bg-white w-[285px] border-r-2 border-[#DEDEDE]/90 pt-[24.5px] px-[32px]">
        <Link href={"/"}>
          <button
            className="font-semibold flex items-center gap-5 hover:text-red transition text-[14px] lg:text-[16px] mb-[15px]"
            onMouseEnter={() => setIsBtnHovered(true)}
            onMouseLeave={() => setIsBtnHovered(false)}
          >
            <Image
              className={isBtnHovered ? "animate-bounce-x" : ""}
              src={ArrowL}
              alt=""
            />
            Back to Home
          </button>
        </Link>
        <Image src={DashboardLogo} alt="Dashboard Logo" />
        <h1 className="font-jakarta font-semibold mt-[25px]">
          {isLeader ? "LEADER MENU" : "ADMIN MENU"}
        </h1>
        <div className="mt-[28px] min-h-[50%] flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            {!isLeader ? (
              <>
                <MenuItem
                  title="Overview"
                  icon={pathname === "/admin" ? HomeActive : Home}
                  active={pathname === "/admin"}
                  link="/admin"
                />
                <MenuItem
                  title="Members"
                  icon={pathname === "/admin/members" ? HistoryActive : History}
                  active={pathname === "/admin/members"}
                  link="/admin/members"
                />
                <MenuItem
                  title="Project Requests"
                  icon={pathname === "/admin/requests" ? RequestActive : Request}
                  active={pathname === "/admin/requests"}
                  link="/admin/requests"
                />
                <MenuItem
                  title="Settings"
                  icon={pathname === "/admin/settings" ? GuideActive : Guide}
                  active={pathname === "/admin/settings"}
                  link="/admin/settings"
                />
                <MenuItem
                  title="Analytics"
                  icon={pathname === "/admin/analytics" ? FaqActive : Faq}
                  active={pathname === "/admin/analytics"}
                  link="/admin/analytics"
                />
              </>
            ) : (
              <>
                <MenuItem
                  title="Overview"
                  icon={pathname === "/leader" ? HomeActive : Home}
                  active={pathname === "/leader"}
                  link="/leader"
                />
                <MenuItem
                  title="Strategic Overview"
                  icon={pathname === "/leader/overview" ? HistoryActive : History}
                  active={pathname === "/leader/overview"}
                  link="/leader/overview"
                />
                <MenuItem
                  title="Financial Reports"
                  icon={pathname === "/leader/finance" ? RequestActive : Request}
                  active={pathname === "/leader/finance"}
                  link="/leader/finance"
                />
                <MenuItem
                  title="Team Management"
                  icon={pathname === "/leader/teams" ? GuideActive : Guide}
                  active={pathname === "/leader/teams"}
                  link="/leader/teams"
                />
                <MenuItem
                  title="Decision Portal"
                  icon={pathname === "/leader/decisions" ? FaqActive : Faq}
                  active={pathname === "/leader/decisions"}
                  link="/leader/decisions"
                />
              </>
            )}
          </div>
          <button
            onClick={() => {
              signOut({
                callbackUrl: "/",
              }).then(() => {
                r.replace("/");
              });
            }}
            className="font-jakarta w-full flex justify-start items-center px-4 py-[14px] gap-3 text-[#A3A3A3] hover:bg-red/70 active:bg-red hover:text-white transition rounded-[10px]"
          >
            <Image src={Logout} alt="" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <aside className="w-full">{children}</aside>
    </main>
  );
}

function MenuItem({
  title,
  link,
  icon,
  active,
}: {
  title: string;
  link: string;
  icon: StaticImageData;
  active: boolean;
}) {
  return (
    <Link href={link}>
      <button
        className={
          "px-4 py-[14px] font-jakarta flex justify-start items-center gap-3 w-full font-semibold rounded-[10px] transition hover:bg-red/70 " +
          (active ? "bg-red! text-white" : "text-[#A3A3A3]")
        }
      >
        <Image src={icon} alt="" />
        <span>{title}</span>
      </button>
    </Link>
  );
}
