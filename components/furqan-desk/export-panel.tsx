"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Eye, Download, Copy } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { PhotoPlaceholder } from "@/components/brand/photo-placeholder";
import { currency, type CustomerRequest } from "@/lib/furqan-desk/mock-data";

export function ExportPanel({ request }: { request: CustomerRequest }) {
  const [reviewed, setReviewed] = useState(false);

  const rows = request.items.map((item) => ({
    styleNo: item.customerStyleNo,
    productReference: item.internalDesign ?? "Pending manual match",
    diamondWeight: item.diamondWeight ?? "—",
    quantity: item.quantity,
    value: item.value,
    totalValue: item.value != null ? item.value * item.quantity : null,
  }));

  const toTsv = () =>
    [
      ["Style No.", "Product Reference", "Diamond Wt", "Quantity", "Value", "Total Value"].join("\t"),
      ...rows.map((r) =>
        [
          r.styleNo,
          r.productReference,
          r.diamondWeight,
          r.quantity,
          r.value != null ? r.value : "",
          r.totalValue != null ? r.totalValue : "",
        ].join("\t")
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
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Style No.</TableHead>
                <TableHead>Product Reference</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Diamond Wt</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {request.items.map((item, i) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-brand-brown">{rows[i].styleNo}</TableCell>
                  <TableCell>{rows[i].productReference}</TableCell>
                  <TableCell>
                    <div className="relative size-9 overflow-hidden rounded-md border border-border/50">
                      <PhotoPlaceholder variant={item.imageVariant} />
                    </div>
                  </TableCell>
                  <TableCell>{rows[i].diamondWeight}</TableCell>
                  <TableCell className="text-right">{rows[i].quantity}</TableCell>
                  <TableCell className="text-right">
                    {rows[i].value != null ? currency(rows[i].value!) : "—"}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {rows[i].totalValue != null ? currency(rows[i].totalValue!) : "—"}
                  </TableCell>
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
