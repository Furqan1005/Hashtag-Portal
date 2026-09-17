"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Eye, Download, Copy } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { PhotoPlaceholder } from "@/components/brand/photo-placeholder";
import { jemrData, type CurrencyCode, type CustomerRequest } from "@/lib/furqan-desk/mock-data";
import { DEFAULT_EXPORT_COLUMNS, formatExportCell, type ExportRow } from "@/lib/furqan-desk/export-format";
import { cn } from "@/lib/utils";

export function ExportPanel({
  request,
  currencyCode = "INR",
}: {
  request: CustomerRequest;
  currencyCode?: CurrencyCode;
}) {
  const [reviewed, setReviewed] = useState(false);

  const rows: ExportRow[] = request.items.map((item) => {
    const record = item.internalDesign ? jemrData[item.internalDesign] : undefined;
    return {
      styleNo: item.customerStyleNo,
      productReference: item.internalDesign ?? "Pending manual match",
      material: record ? `${record.kt} ${record.metal}` : item.metal,
      diamondWeight: item.diamondWeight ?? "—",
      quantity: item.quantity,
      value: item.value,
      totalValue: item.value != null ? item.value * item.quantity : null,
    };
  });

  const toTsv = () =>
    [
      DEFAULT_EXPORT_COLUMNS.map((c) => c.label).join("\t"),
      ...rows.map((row) =>
        DEFAULT_EXPORT_COLUMNS.map((c) => formatExportCell(c, row, currencyCode)).join("\t")
      ),
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
    a.download = `${request.customer.replace(/\s+/g, "-").toLowerCase()}-order-preview.tsv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Mock Excel export downloaded (local demo file, not a real order)");
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
          <CardTitle className="text-base">Customer Order Excel Preview</CardTitle>
          <CardDescription>
            Prepared automatically from the workspace above — instead of building this row by row.
            Using the default demo column layout until you supply your team&apos;s real export
            format.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{DEFAULT_EXPORT_COLUMNS[0].label}</TableHead>
                <TableHead>Image</TableHead>
                {DEFAULT_EXPORT_COLUMNS.slice(1).map((c) => (
                  <TableHead key={c.key} className={c.align === "right" ? "text-right" : undefined}>
                    {c.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {request.items.map((item, i) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-brand-brown">
                    {formatExportCell(DEFAULT_EXPORT_COLUMNS[0], rows[i], currencyCode)}
                  </TableCell>
                  <TableCell>
                    <div className="relative size-9 overflow-hidden rounded-md border border-border/50">
                      <PhotoPlaceholder src={item.imageSrc} variant={item.imageVariant} alt={item.customerStyleNo} />
                    </div>
                  </TableCell>
                  {DEFAULT_EXPORT_COLUMNS.slice(1).map((c) => (
                    <TableCell
                      key={c.key}
                      className={cn(c.align === "right" && "text-right", c.key === "totalValue" && "font-medium")}
                    >
                      {formatExportCell(c, rows[i], currencyCode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
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
