import { Layers, ShieldCheck, Gauge, FolderKanban } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: Layers,
    title: "1. Reduce Manual Work",
    body: "Less repetitive searching and copying across multiple files. AI prepares the first draft; the team reviews instead of rebuilding it from scratch.",
  },
  {
    icon: FolderKanban,
    title: "2. One Workspace",
    body: "Bring information currently spread across multiple Excel files, JEMR and pricing sheets into a single order workspace, without replacing those systems.",
  },
  {
    icon: ShieldCheck,
    title: "3. Human Verification Stays Central",
    body: "Nothing is finalized without a person confirming it. Every AI suggestion is clearly labelled and editable before it becomes a real quotation or order.",
  },
  {
    icon: Gauge,
    title: "4. Consistent, Faster Turnaround",
    body: "The same customer-specific terminology, pricing and confirmed mappings are applied consistently every time, so responses go out faster as volume grows.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div>
        <h1 className="font-heading text-4xl font-semibold text-brand-brown">Why Estrella&apos;s Autopilot?</h1>
        <p className="text-brand-brown/60 mt-1.5 max-w-2xl text-sm">
          A prototype for reducing repetitive manual work — not for replacing the team&apos;s
          judgement on every order.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {benefits.map((b) => (
          <Card key={b.title}>
            <CardHeader>
              <div className="bg-sidebar-active flex size-11 items-center justify-center rounded-full">
                <b.icon className="text-brand-brown size-5" />
              </div>
              <CardTitle className="mt-2 text-lg">{b.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-brand-brown/70 text-sm">{b.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-warning/30">
        <CardContent>
          <p className="text-sm font-semibold text-brand-brown">A prototype, not a rollout plan</p>
          <p className="text-brand-brown/65 mt-1 text-sm">
            This demo uses mock/sample data throughout and is not connected to JEMR, CRM, Zoho, or
            any live pricing or order system. It exists to show management the concept — reducing
            repetitive searching, matching, and data entry, while keeping human verification before
            anything is finalized.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
