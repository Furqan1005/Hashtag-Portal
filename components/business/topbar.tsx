"use client";

import { usePathname } from "next/navigation";

import { AccountDropdown } from "@/components/business/account-dropdown";

const PAGE_TITLES: Record<string, { title: string; subtitle?: string }> = {
  "/business/designs": {
    title: "My Designs",
    subtitle: "Browse the house archive, shortlist pieces and place your order.",
  },
  "/business/selection-bucket": {
    title: "My Selection Bucket",
    subtitle:
      "Please preview your selected items. You can save for later, remove or proceed further.",
  },
  "/business/selection-bucket/order": {
    title: "Place Final Order",
    subtitle:
      "Please preview your selected items. You can save for later, remove or proceed further.",
  },
  "/business/saved": {
    title: "Saved",
    subtitle: "Items you've set aside to review or reorder later.",
  },
  "/business/new-arrivals": {
    title: "New Arrivals",
    subtitle: "Freshly added to the house archive.",
  },
  "/business/reports/order-history": {
    title: "Order History",
    subtitle: "View and track your placed orders.",
  },
  "/business/reports/quotes": {
    title: "Quotes Created",
    subtitle: "Track quote requests sent to our team.",
  },
  "/business/reports/presentations": {
    title: "Presentations Created",
    subtitle: "Client-ready presentations built from your selections.",
  },
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function Topbar({
  fullName,
  email,
  avatarUrl,
}: {
  fullName: string;
  email: string | null;
  avatarUrl: string | null;
}) {
  const pathname = usePathname();
  const isDashboard = pathname === "/business/dashboard";
  const page = PAGE_TITLES[pathname];

  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const firstName = fullName.split(" ")[0] || fullName;

  return (
    <header className="flex items-start justify-between gap-6 px-8 pt-8 pb-6 sm:px-10">
      <div>
        {isDashboard ? (
          <>
            <p className="text-brand-brown/55 text-sm font-medium tracking-wide">{today}</p>
            <h1 className="font-heading mt-1 text-4xl font-semibold text-brand-brown">
              {getGreeting()}, {firstName}
            </h1>
          </>
        ) : (
          page && (
            <>
              <h1 className="font-heading text-4xl font-semibold text-brand-brown">
                {page.title}
              </h1>
              {page.subtitle && (
                <p className="text-brand-brown/60 mt-1.5 max-w-xl text-sm">{page.subtitle}</p>
              )}
            </>
          )
        )}
      </div>
      <AccountDropdown fullName={fullName} email={email} avatarUrl={avatarUrl} />
    </header>
  );
}
