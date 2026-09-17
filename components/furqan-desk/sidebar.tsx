"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MailPlus,
  ListTodo,
  BookMarked,
  History,
  AlertTriangle,
  Workflow,
  Scale,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  { href: "/furqan-desk", label: "Dashboard", icon: LayoutDashboard },
  { href: "/furqan-desk/intake", label: "Email Intake", icon: MailPlus },
  { href: "/furqan-desk/queue", label: "Request Queue", icon: ListTodo },
  { href: "/furqan-desk/knowledge", label: "Customer Knowledge", icon: BookMarked },
  { href: "/furqan-desk/learning", label: "AI Learning History", icon: History },
  { href: "/furqan-desk/exceptions", label: "Exceptions", icon: AlertTriangle },
  { href: "/furqan-desk/process", label: "Process Flow", icon: Workflow },
  { href: "/furqan-desk/comparison", label: "Current vs Future", icon: Scale },
  { href: "/furqan-desk/about", label: "Why Estrella's Autopilot", icon: Sparkles },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3.5 pt-5 pb-1.5 text-[11px] font-semibold tracking-[0.14em] text-brand-brown/45 uppercase">
      {children}
    </p>
  );
}

export function FurqanSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar-surface sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-border/50 px-3.5 py-6">
      <Link href="/furqan-desk" className="px-3.5">
        <p className="font-heading text-2xl font-semibold text-brand-brown">Estrella&apos;s Autopilot</p>
        <p className="text-brand-brown/55 text-xs font-medium tracking-wide">Prototype / demo</p>
      </Link>

      <nav className="mt-4 flex-1 overflow-y-auto">
        <SectionLabel>Workspace</SectionLabel>
        <div className="flex flex-col gap-1">
          {links.slice(0, 3).map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-150",
                  active
                    ? "bg-sidebar-active text-brand-brown shadow-sm"
                    : "text-brand-brown/70 hover:bg-sidebar-active/60 hover:text-brand-brown"
                )}
              >
                <link.icon className="size-4.5 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        <SectionLabel>Knowledge & Learning</SectionLabel>
        <div className="flex flex-col gap-1">
          {links.slice(3, 6).map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-150",
                  active
                    ? "bg-sidebar-active text-brand-brown shadow-sm"
                    : "text-brand-brown/70 hover:bg-sidebar-active/60 hover:text-brand-brown"
                )}
              >
                <link.icon className="size-4.5 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        <SectionLabel>Management View</SectionLabel>
        <div className="flex flex-col gap-1">
          {links.slice(6).map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-150",
                  active
                    ? "bg-sidebar-active text-brand-brown shadow-sm"
                    : "text-brand-brown/70 hover:bg-sidebar-active/60 hover:text-brand-brown"
                )}
              >
                <link.icon className="size-4.5 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-brand-brown/10 px-3.5 pt-4">
        <Link href="/" className="text-brand-brown/50 hover:text-brand-brown text-xs font-medium">
          ← Back to portal picker
        </Link>
      </div>
    </aside>
  );
}
