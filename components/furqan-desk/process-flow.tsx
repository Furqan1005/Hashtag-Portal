import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function ProcessFlow({
  steps,
  variant = "default",
  className,
}: {
  steps: string[];
  variant?: "default" | "compact";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <span
            className={cn(
              "bg-sidebar-active text-brand-brown rounded-full border border-brand-brown/10 font-medium",
              variant === "compact" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
            )}
          >
            {step}
          </span>
          {i < steps.length - 1 && (
            <ArrowRight className="text-brand-brown/35 size-4 shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}
