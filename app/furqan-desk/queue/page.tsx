import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { requests } from "@/lib/furqan-desk/mock-data";

const aiStatusVariant = {
  Processed: "success",
  "Medium Confidence": "warning",
  "Manual Intervention": "destructive",
} as const;

export default function RequestQueuePage() {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div>
        <h1 className="font-heading text-4xl font-semibold text-brand-brown">Request Queue</h1>
        <p className="text-brand-brown/60 mt-1.5 max-w-xl text-sm">
          Incoming customer requests, as AI has processed them. Click a row to open its Order
          Workspace.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
          <CardDescription>Demo queue — sample requests only.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Request</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead>AI Status</TableHead>
                <TableHead>Human Review</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-brand-brown">{r.customer}</TableCell>
                  <TableCell>{r.subject}</TableCell>
                  <TableCell className="text-right">{r.items.length}</TableCell>
                  <TableCell>
                    <Badge variant={aiStatusVariant[r.aiStatus]}>{r.aiStatus}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={r.humanReviewRequired ? "warning" : "outline"}>
                      {r.humanReviewRequired ? "Required" : "Not Required"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={r.queueStatus === "Ready" ? "success" : "warning"}>
                      {r.queueStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/furqan-desk/requests/${r.id}`}
                      className="text-brand-brown/60 hover:text-brand-brown inline-flex items-center gap-1 text-sm font-medium"
                    >
                      Open <ArrowRight className="size-3.5" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
