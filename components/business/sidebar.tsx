"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Bookmark,
  Gem,
  ShoppingBag,
  Sparkles,
  Users,
  Briefcase,
  ChevronDown,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

const overviewLinks = [
  { href: "/business/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/business/saved", label: "Saved", icon: Bookmark },
  { href: "/business/designs", label: "Design Gallery", icon: Gem },
  { href: "/business/selection-bucket", label: "Selection Bucket", icon: ShoppingBag },
  { href: "/business/new-arrivals", label: "New Arrivals", icon: Sparkles },
];

const reportLinks = [
  { href: "/business/reports/order-history", label: "Order History" },
  { href: "/business/reports/quotes", label: "Quotes Created" },
  { href: "/business/reports/presentations", label: "Presentations Created" },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-150",
        active
          ? "bg-sidebar-active text-brand-brown shadow-sm"
          : "text-brand-brown/70 hover:bg-sidebar-active/60 hover:text-brand-brown"
      )}
    >
      <Icon className="size-4.5 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

function ComingSoonRow({
  label,
  icon: Icon,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex cursor-not-allowed items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-brand-brown/35">
      <span className="flex items-center gap-3">
        <Icon className="size-4.5 shrink-0" />
        {label}
      </span>
      <span className="rounded-full bg-brand-brown/8 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
        Soon
      </span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3.5 pt-5 pb-1.5 text-[11px] font-semibold tracking-[0.14em] text-brand-brown/45 uppercase">
      {children}
    </p>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const reportsActive = pathname.startsWith("/business/reports");
  const [reportsOpen, setReportsOpen] = useState(reportsActive);

  return (
    <aside className="sidebar-surface sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-border/50 px-3.5 py-6">
      <Link href="/business/dashboard" className="px-3.5">
        <Logo />
      </Link>

      <nav className="mt-4 flex-1 overflow-y-auto">
        <SectionLabel>Overview</SectionLabel>
        <div className="flex flex-col gap-1">
          <NavLink
            href={overviewLinks[0].href}
            label={overviewLinks[0].label}
            icon={overviewLinks[0].icon}
            active={pathname === overviewLinks[0].href}
          />

          <button
            type="button"
            onClick={() => setReportsOpen((v) => !v)}
            className={cn(
              "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-150",
              reportsActive
                ? "bg-sidebar-active text-brand-brown shadow-sm"
                : "text-brand-brown/70 hover:bg-sidebar-active/60 hover:text-brand-brown"
            )}
          >
            <span className="flex items-center gap-3">
              <ClipboardList className="size-4.5 shrink-0" />
              Reports
            </span>
            <ChevronDown
              className={cn(
                "size-4 shrink-0 transition-transform duration-150",
                reportsOpen && "rotate-180"
              )}
            />
          </button>
          {reportsOpen && (
            <div className="ml-4 flex flex-col gap-0.5 border-l border-brand-brown/10 pl-3.5">
              {reportLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-150",
                    pathname === link.href
                      ? "bg-sidebar-active text-brand-brown"
                      : "text-brand-brown/60 hover:bg-sidebar-active/50 hover:text-brand-brown"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {overviewLinks.slice(1).map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              icon={link.icon}
              active={pathname === link.href}
            />
          ))}
        </div>

        <SectionLabel>Team</SectionLabel>
        <ComingSoonRow label="My Staff" icon={Users} />

        <SectionLabel>Business</SectionLabel>
        <ComingSoonRow label="Apply Now" icon={Briefcase} />
      </nav>
    </aside>
  );
}
