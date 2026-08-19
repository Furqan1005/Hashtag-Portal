import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground flex min-h-20 w-full rounded-lg border bg-white/60 px-3.5 py-2.5 text-sm shadow-sm transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
