import type { ComponentType } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  iconBgClassName,
  iconClassName,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  iconBgClassName?: string;
  iconClassName?: string;
}) {
  return (
    <Card>
      <div className="flex items-center gap-3.5 px-5">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full",
            iconBgClassName ?? "bg-sidebar-active"
          )}
        >
          <Icon className={cn("size-5", iconClassName ?? "text-brand-brown")} />
        </div>
        <div>
          <p className="text-brand-brown font-heading text-2xl font-semibold">{value}</p>
          <p className="text-brand-brown/55 text-xs font-medium tracking-wide uppercase">
            {label}
          </p>
        </div>
      </div>
    </Card>
  );
}
