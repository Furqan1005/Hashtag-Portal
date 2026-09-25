"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Eye, Download, Copy } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter } from "@/components/ui/table";
import { currency, type CurrencyCode, type CustomerRequest } from "@/lib/furqan-desk/mock-data";
import {
  DEFAULT_EXPORT_COLUMNS,
  buildExportRow,
  computeExportTotals,
  formatExportCell,
} from "@/lib/furqan-desk/export-format";
import { cn } from "@/lib/utils";

export function ExportPanel({
  request,
  // The team's real order confirmation is always priced in USD, regardless
  // of the customer's internal/JEMR pricing currency shown elsewhere in the
  // workspace — so the export format follows the template, not the request.
  currencyCode = "USD",
}: {
  request: CustomerRequest;
  currencyCode?: CurrencyCode;
}) {
  const [reviewed, setReviewed] = useState(false);

  const rows = request.items.map((item, i) => buildExportRow(item, i));
  const totals = computeExportTotals(rows);

  const toTsv = () =>
    [
      `Gold price based on current rate (demo)`,
      DEFAULT_EXPORT_COLUMNS.map((c) => c.label).join("\t"),
      ...rows.map((row) =>
        DEFAULT_EXPORT_COLUMNS.map((c) => formatExportCell(c, row, currencyCode)).join("\t")
      ),
      "",
      `Total\t\t\t\t\t\t\t\t${totals.quantity}\t${totals.amount}`,
      `30% Advance\t\t\t\t\t\t\t\t\t${totals.advance}`,
    ].join("\n");

  const handleReview = () => {
    setReviewed(true);
    toast.success("Excel preview reviewed");
  };

  const handleExport = () => {
    const blob = new Blob([toTsv()], { type: "text/tab-separated-values" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${request.customer.replace(/\s+/g, "-").toLowerCase()}-order-confirmation.tsv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Mock order confirmation downloaded (local demo file, not a real order)");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(toTsv());
      toast.success("Order data copied to clipboard");
    } catch {
      toast.error("Couldn't access the clipboard in this browser");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order Confirmation Preview</CardTitle>
          <CardDescription>
            Prepared automatically from the workspace above, in the team&apos;s real reply-to-customer
            format — instead of building this row by row.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-brand-brown/50 mb-3 text-xs italic">
            Gold price based on current rate (demo placeholder — not a live rate feed)
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                {DEFAULT_EXPORT_COLUMNS.map((c, i) => (
                  <TableHead key={`${c.key}-${i}`} className={c.align === "right" ? "text-right" : undefined}>
                    {c.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={request.items[i].id}>
                  {DEFAULT_EXPORT_COLUMNS.map((c, ci) => (
                    <TableCell key={`${c.key}-${ci}`} className={cn(c.align === "right" && "text-right")}>
                      {formatExportCell(c, row, currencyCode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={8}>Total</TableCell>
                <TableCell className="text-right">{totals.quantity}</TableCell>
                <TableCell className="text-right">{currency(totals.amount, currencyCode)}</TableCell>
                <TableCell colSpan={2} />
              </TableRow>
              <TableRow>
                <TableCell colSpan={9}>30% Advance</TableCell>
                <TableCell className="text-right">{currency(totals.advance, currencyCode)}</TableCell>
                <TableCell colSpan={2} />
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={handleReview}>
          <Eye className="size-4" /> Review Excel
        </Button>
        <Button variant="accent" onClick={handleExport}>
          <Download className="size-4" /> Export Excel
        </Button>
        <Button variant="ghost" onClick={handleCopy}>
          <Copy className="size-4" /> Copy Data
        </Button>
        {reviewed && (
          <span className="text-success text-xs font-medium">Reviewed by you just now</span>
        )}
      </div>

      <p className="text-brand-brown/45 text-xs">
        Demo export only — this downloads a local mock file and does not create a real order, touch
        JEMR/CRM/Zoho, or modify any existing Excel file.
      </p>
    </div>
  );
}
