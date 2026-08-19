import Link from "next/link";
import type { ComponentType } from "react";

import { Button } from "@/components/ui/button";

export function ReportsEmptyState({
  icon: Icon,
  message,
}: {
  icon: ComponentType<{ className?: string }>;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <Icon className="text-brand-brown/25 size-10" />
      <p className="text-brand-brown/60 text-sm">{message}</p>
      <Button asChild variant="outline">
        <Link href="/business/designs">Browse Designs</Link>
      </Button>
    </div>
  );
}
