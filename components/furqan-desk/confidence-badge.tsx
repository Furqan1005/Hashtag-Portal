import { Badge } from "@/components/ui/badge";
import type { Confidence } from "@/lib/furqan-desk/mock-data";

const CONFIG: Record<Confidence, { label: string; variant: "success" | "warning" | "destructive"; action: string }> = {
  high: { label: "Match Confidence: High", variant: "success", action: "Confirm" },
  medium: { label: "Match Confidence: Medium", variant: "warning", action: "Review" },
  low: { label: "Match Confidence: Low", variant: "destructive", action: "Manual Input Required" },
};

export function ConfidenceBadge({ level, className }: { level: Confidence; className?: string }) {
  const config = CONFIG[level];
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}

export function confidenceAction(level: Confidence) {
  return CONFIG[level].action;
}

export function confidenceLabel(level: Confidence) {
  return CONFIG[level].label;
}
