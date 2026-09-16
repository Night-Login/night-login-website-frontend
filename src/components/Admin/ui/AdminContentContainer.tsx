import React, { ReactNode } from "react";

interface AdminContentContainerProps {
  children?: ReactNode;
  emptyNotice?: string;
}

export default function AdminContentContainer({
  children,
  emptyNotice = "Content area ready for development.",
}: AdminContentContainerProps) {
  if (children) {
    return <div className="mt-6">{children}</div>;
  }

  return (
    <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-xs">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400">
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
          />
        </svg>
      </div>
      <h3 className="mt-4 text-base font-semibold font-jakarta text-gray-900">
        {emptyNotice}
      </h3>
      <p className="mt-1 text-sm font-jakarta text-gray-500">
        This page content is currently unpopulated and prepared for implementation.
      </p>
    </div>
  );
}
