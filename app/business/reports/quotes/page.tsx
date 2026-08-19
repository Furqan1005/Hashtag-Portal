import { FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReportsEmptyState } from "@/components/business/reports/reports-empty-state";
import { getQuotes } from "@/lib/data/quotes";

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

const STATUS_VARIANT = {
  pending: "outline",
  responded: "success",
  closed: "default",
} as const;

export default async function QuotesPage() {
  const quotes = await getQuotes();

  if (quotes.length === 0) {
    return <ReportsEmptyState icon={FileText} message="No quotes requested yet." />;
  }

  return (
    <div className="pt-2">
      <div className="card-surface overflow-hidden rounded-xl border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell>{dateFormatter.format(new Date(quote.created_at))}</TableCell>
                <TableCell className="text-brand-brown/70 max-w-xs truncate whitespace-normal">
                  {quote.notes || "—"}
                </TableCell>
                <TableCell>{quote.itemCount} items</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[quote.status]} className="capitalize">
                    {quote.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" disabled>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
