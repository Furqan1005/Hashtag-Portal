import Link from "next/link";
import { ClipboardList, Bot, Eye, AlertTriangle, BookMarked, Clock, ArrowRight } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/furqan-desk/stat-card";
import { ProcessFlow } from "@/components/furqan-desk/process-flow";
import { dashboardMetrics, requests } from "@/lib/furqan-desk/mock-data";

export default function FurqanDeskDashboard() {
  return (
    <div className="flex flex-col gap-8 pt-2">
      <div>
        <h1 className="font-heading text-4xl font-semibold text-brand-brown">Furqan&apos;s Desk</h1>
        <p className="text-brand-brown/60 mt-1.5 max-w-2xl text-sm">
          AI-Assisted Customer Order &amp; Quotation Workspace
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Today's Requests" value={dashboardMetrics.todaysRequests} icon={ClipboardList} />
        <StatCard label="AI Processed" value={dashboardMetrics.aiProcessed} icon={Bot} />
        <StatCard label="Awaiting Review" value={dashboardMetrics.awaitingReview} icon={Eye} />
        <StatCard label="Manual Intervention" value={dashboardMetrics.manualIntervention} icon={AlertTriangle} />
        <StatCard
          label="Customer Knowledge Mappings"
          value={dashboardMetrics.knowledgeMappings}
          icon={BookMarked}
        />
        <StatCard
          label="Time Saved"
          value="Demo metric"
          caption={dashboardMetrics.timeSavedLabel}
          icon={Clock}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How a request flows through Furqan&apos;s Desk</CardTitle>
        </CardHeader>
        <CardContent>
          <ProcessFlow
            steps={[
              "Customer Email",
              "AI Reads Request",
              "Extracts Order Details",
              "Understands Terminology",
              "Matches Internal Design",
              "Fetches Pricing",
              "Prepares Order",
              "Human Verification",
              "Final Output",
            ]}
            variant="compact"
          />
          <Link
            href="/furqan-desk/process"
            className="text-brand-brown/60 hover:text-brand-brown mt-4 inline-flex items-center gap-1 text-sm font-medium"
          >
            View full process visualization <ArrowRight className="size-3.5" />
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Request Queue</CardTitle>
            <Link href="/furqan-desk/queue" className="text-brand-brown/60 hover:text-brand-brown text-sm font-medium">
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {requests.map((r) => (
            <Link
              key={r.id}
              href={`/furqan-desk/requests/${r.id}`}
              className="hover-lift flex items-center justify-between rounded-xl border border-border/50 bg-white/40 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-brand-brown">{r.customer}</p>
                <p className="text-brand-brown/55 text-xs">
                  {r.subject} · {r.items.length} item{r.items.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{r.aiStatus}</Badge>
                <Badge variant={r.queueStatus === "Ready" ? "success" : "warning"}>
                  {r.queueStatus === "Ready" ? "Ready" : "Review"}
                </Badge>
              </div>
            </Link>
          ))}
          <Button asChild variant="ghost" className="mt-1 w-fit">
            <Link href="/furqan-desk/queue">
              Open Request Queue <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
