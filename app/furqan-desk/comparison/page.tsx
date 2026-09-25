import { ArrowDown } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const current = [
  "Customer Email",
  "Excel 1",
  "Excel 2",
  "Platinum Excel",
  "JEMR",
  "Manual Matching",
  "Manual Data Entry",
  "Manual Verification",
  "Final Excel",
];

const future = [
  "Customer Email",
  "AI Extraction",
  "Customer Knowledge",
  "Design Matching",
  "Pricing Retrieval",
  "Order Preparation",
  "Human Verification",
  "Final Output",
];

function Column({ title, subtitle, items, tone }: { title: string; subtitle: string; items: string[]; tone: "current" | "future" }) {
  return (
    <Card className={cn(tone === "future" && "border-accent/40")}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          {items.map((step, i) => (
            <div key={step} className="flex w-full flex-col items-center">
              <div
                className={cn(
                  "w-full rounded-xl border px-4 py-2.5 text-center text-sm font-medium shadow-sm",
                  tone === "current"
                    ? "border-destructive/25 bg-destructive/8 text-brand-brown"
                    : "border-brand-brown/10 bg-sidebar-active text-brand-brown"
                )}
              >
                {step}
              </div>
              {i < items.length - 1 && (
                <ArrowDown className="text-brand-brown/25 my-1.5 size-3.5 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ComparisonPage() {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div>
        <h1 className="font-heading text-4xl font-semibold text-brand-brown">
          Current Process vs Estrella&apos;s Autopilot
        </h1>
        <p className="text-brand-brown/60 mt-1.5 max-w-2xl text-sm">
          Same order-specific detail every time — the reduction is in the repetitive searching,
          matching, copying and checking across systems.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Column
          title="Current Process"
          subtitle="Multiple Excel files, JEMR, and manual matching for every order."
          items={current}
          tone="current"
        />
        <Column
          title="Estrella's Autopilot"
          subtitle="One workspace, with human verification always in the loop."
          items={future}
          tone="future"
        />
      </div>
    </div>
  );
}
