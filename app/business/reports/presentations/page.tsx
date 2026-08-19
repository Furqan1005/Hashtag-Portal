import { Presentation as PresentationIcon } from "lucide-react";

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
import { getPresentations } from "@/lib/data/presentations";

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

const STATUS_VARIANT = {
  draft: "outline",
  sent: "success",
} as const;

export default async function PresentationsPage() {
  const presentations = await getPresentations();

  if (presentations.length === 0) {
    return <ReportsEmptyState icon={PresentationIcon} message="No presentations created yet." />;
  }

  return (
    <div className="pt-2">
      <div className="card-surface overflow-hidden rounded-xl border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {presentations.map((presentation) => (
              <TableRow key={presentation.id}>
                <TableCell className="text-brand-brown font-medium">
                  {presentation.name}
                </TableCell>
                <TableCell>{dateFormatter.format(new Date(presentation.created_at))}</TableCell>
                <TableCell>{presentation.itemCount} items</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[presentation.status]} className="capitalize">
                    {presentation.status}
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
