"use client";

import Link from "next/link";
import AdminPageHeader from "@/components/Admin/ui/AdminPageHeader";
import { initialAdminData } from "@/modules/admin/data/mockData";

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Users",
      count: initialAdminData.users.length,
      href: "/admin/users",
      description: "Admin & system users",
      icon: "👤",
    },
    {
      title: "Talents",
      count: initialAdminData.talents.length,
      href: "/admin/talents",
      description: "Talents & member profiles",
      icon: "🌟",
    },
    {
      title: "Projects",
      count: initialAdminData.projects.length,
      href: "/admin/projects",
      description: "Showcase & organization projects",
      icon: "📁",
    },
    {
      title: "Organizations",
      count: initialAdminData.organizations.length,
      href: "/admin/organizations",
      description: "Experience & track records",
      icon: "🏢",
    },
    {
      title: "Skills",
      count: initialAdminData.skills.length,
      href: "/admin/skills",
      description: "Frontend, backend & tech skills",
      icon: "⚡",
    },
    {
      title: "Academic Grades",
      count: initialAdminData.grades.length,
      href: "/admin/grades",
      description: "Academic & course records",
      icon: "🎓",
    },
  ];

  return (
    <div className="p-8">
      <AdminPageHeader
        title="Admin Overview"
        subtitle="Night Login Administration & Content Management System"
        badge="Admin"
      />

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider font-jakarta mb-4">
          Data Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-xs transition hover:border-red/40 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{item.icon}</span>
                <span className="text-2xl font-bold font-jakarta text-gray-900 group-hover:text-red transition">
                  {item.count}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold font-jakarta text-gray-900 group-hover:text-red transition">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500 font-jakarta">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
