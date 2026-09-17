import { Bot, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";
import type { FieldAudit } from "@/lib/furqan-desk/mock-data";

export function AuditTag({ source, className }: { source: FieldAudit; className?: string }) {
  const isHuman = source === "human";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
        isHuman ? "bg-success/15 text-success" : "bg-brand-brown/8 text-brand-brown/55",
        className
      )}
    >
      {isHuman ? <UserRound className="size-2.5" /> : <Bot className="size-2.5" />}
      {isHuman ? "Human Updated" : "AI Suggested"}
    </span>
  );
}
