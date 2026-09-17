import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  caption,
  icon: Icon,
  className,
}: {
  label: string;
  value: string | number;
  caption?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <Card className={cn("gap-2", className)}>
      <div className="flex items-center justify-between px-5">
        <p className="text-brand-brown/55 text-xs font-semibold tracking-[0.1em] uppercase">
          {label}
        </p>
        {Icon && (
          <div className="bg-sidebar-active flex size-8 items-center justify-center rounded-full">
            <Icon className="text-brand-brown size-4" />
          </div>
        )}
      </div>
      <div className="px-5">
        <p className="font-heading text-3xl font-semibold text-brand-brown">{value}</p>
        {caption && <p className="text-brand-brown/50 mt-1 text-xs">{caption}</p>}
      </div>
    </Card>
  );
}
