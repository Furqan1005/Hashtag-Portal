import { ArrowDown } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const steps = [
  "Customer Email",
  "AI Reads Request",
  "Extracts Order Details",
  "Understands Customer Terminology",
  "Matches Internal Design",
  "Fetches Customer Pricing",
  "Checks Secondary Pricing if Required",
  "Prepares Order / Quotation",
  "Human Verification",
  "Final Excel / Order Output",
];

export default function ProcessPage() {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div>
        <h1 className="font-heading text-4xl font-semibold text-brand-brown">Process Visualization</h1>
        <p className="text-brand-brown/60 mt-1.5 max-w-2xl text-sm">
          How a single customer request moves through Estrella&apos;s Autopilot, end to end.
        </p>
      </div>

      <Card>
        <CardContent>
          <div className="mx-auto flex max-w-md flex-col items-center">
            {steps.map((step, i) => (
              <div key={step} className="flex flex-col items-center">
                <div className="bg-sidebar-active w-full rounded-xl border border-brand-brown/10 px-5 py-3 text-center text-sm font-medium text-brand-brown shadow-sm">
                  {step}
                </div>
                {i < steps.length - 1 && (
                  <ArrowDown className="text-brand-brown/30 my-2 size-4 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
