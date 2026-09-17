import { CheckCircle2, PenLine, XCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { learningHistory } from "@/lib/furqan-desk/mock-data";

const actionConfig = {
  Confirmed: { icon: CheckCircle2, variant: "success" as const },
  Corrected: { icon: PenLine, variant: "warning" as const },
  Rejected: { icon: XCircle, variant: "destructive" as const },
};

export default function LearningHistoryPage() {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div>
        <h1 className="font-heading text-4xl font-semibold text-brand-brown">AI Learning History</h1>
        <p className="text-brand-brown/60 mt-1.5 max-w-2xl text-sm">
          Estrella&apos;s Autopilot becomes more useful over time — but only through confirmed human
          decisions, never by learning silently on its own.
        </p>
      </div>

      <div className="relative flex flex-col gap-4 pl-6 before:absolute before:top-1 before:bottom-1 before:left-[7px] before:w-px before:bg-brand-brown/15">
        {learningHistory.map((entry, i) => {
          const config = actionConfig[entry.humanAction];
          const Icon = config.icon;
          return (
            <Card key={`${entry.date}-${i}`} className="relative">
              <span className="border-canvas bg-brand-brown absolute top-6 -left-[29px] size-3.5 rounded-full border-2" />
              <CardContent className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-brand-brown/55 text-xs font-semibold tracking-wide uppercase">
                    {entry.date} · {entry.customer}
                  </p>
                  <Badge variant={config.variant}>
                    <Icon className="size-3" /> {entry.humanAction}
                  </Badge>
                </div>
                <p className="text-sm text-brand-brown">
                  AI suggested:{" "}
                  <span className="font-semibold">
                    {entry.suggestionFrom} → {entry.suggestionTo}
                  </span>
                  {entry.correctedTo && (
                    <>
                      {" "}
                      — corrected to{" "}
                      <span className="font-semibold">{entry.suggestionFrom} → {entry.correctedTo}</span>
                    </>
                  )}
                </p>
                <p className="text-brand-brown/60 text-xs">{entry.status}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
