"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface DashboardStat {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  href: string;
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/requests/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="p-8">Loading...</div>;
  }

  if (session?.user?.role !== "admin") {
    return null; // Don't render until redirected
  }

  const config = {
    title: "Admin Dashboard",
    subtitle: "Manage organization operations and members.",
    stats: [
      {
        title: "Total Members",
        value: "156",
        icon: "👥",
        color: "bg-blue-100",
      },
      {
        title: "Active Projects",
        value: "18",
        icon: "📊",
        color: "bg-green-100",
      },
      {
        title: "Pending Requests",
        value: "7",
        icon: "⏳",
        color: "bg-yellow-100",
      },
      {
        title: "Completed This Month",
        value: "12",
        icon: "✅",
        color: "bg-purple-100",
      },
    ] as DashboardStat[],
    quickActions: [
      {
        title: "Manage Members",
        description: "Add, remove, or edit member information",
        icon: "👥",
        href: "/admin/members",
      },
      {
        title: "Project Requests",
        description: "Review and approve project requests",
        icon: "📋",
        href: "/admin/requests",
      },
      {
        title: "System Settings",
        description: "Configure organization settings",
        icon: "⚙️",
        href: "/admin/settings",
      },
      {
        title: "Analytics",
        description: "View organization analytics",
        icon: "📈",
        href: "/admin/analytics",
      },
    ] as QuickAction[],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">{config.title}</h1>
          <p className="text-gray-600 mt-1">{config.subtitle}</p>
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red/10 text-red">
              Admin
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {config.stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-xs p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`text-4xl ${stat.color} p-3 rounded-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-xs p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {config.quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => router.push(action.href)}
                className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-red hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-3">{action.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-xs p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl">📋</div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  Welcome to Night Login Admin Panel!
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Monitor operations and manage your team from here.
                </p>
                <p className="text-xs text-gray-500 mt-2">Just now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
