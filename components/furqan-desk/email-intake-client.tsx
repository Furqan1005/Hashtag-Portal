"use client";

import { useMemo, useState } from "react";
import { Loader2, Check, Sparkles, RotateCcw, FileSpreadsheet, FileText, Mail, Upload } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderWorkspace } from "@/components/furqan-desk/order-workspace";
import { ExportPanel } from "@/components/furqan-desk/export-panel";
import { cn } from "@/lib/utils";
import { customerKnowledge, getKnowledge, getPricing, type CustomerRequest } from "@/lib/furqan-desk/mock-data";
import { parseEmailToItems } from "@/lib/furqan-desk/parse-email";
import { parseExcelFile, type ExcelParseResult } from "@/lib/furqan-desk/parse-excel";
import { extractPdfText, parsePdfToItems } from "@/lib/furqan-desk/parse-pdf";
import { buildLiveRequest, type ParsedLineItem } from "@/lib/furqan-desk/request-builder";

type Mode = "paste" | "excel" | "pdf";

const PROCESSING_STEPS = [
  "Reading the request",
  "Extracting order details",
  "Understanding customer terminology",
  "Matching internal designs",
  "Fetching customer pricing",
];

const COLUMN_LABELS: Record<string, string> = {
  customerStyleNo: "Style / Item No.",
  internalDesign: "Internal Design",
  metal: "Metal / Material",
  diamondWeight: "Diamond Weight / Carat",
  quantity: "Quantity",
  value: "Value / Price",
  customerReference: "Customer Reference",
  size: "Size",
};

const SAMPLE_EMAIL = `Hi
I want to order

1 x R7769 0,50ct yellow gold size 53
ref 66603

1 x R7771 0,25ct white gold size 54
ref 67738

1 x JR08166 yellow gold size 53
ref 67717

Thank you!

Best regards,
Marisa`;

export function EmailIntakeClient() {
  const [mode, setMode] = useState<Mode>("paste");
  const [customer, setCustomer] = useState(customerKnowledge[0].customer);

  // Paste-email mode
  const [subject, setSubject] = useState("");
  const [from, setFrom] = useState("");
  const [body, setBody] = useState("");

  // Excel mode
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelParse, setExcelParse] = useState<ExcelParseResult | null>(null);
  const [excelLoading, setExcelLoading] = useState(false);
  const [excelError, setExcelError] = useState<string | null>(null);

  // PDF mode
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<CustomerRequest | null>(null);

  const knowledge = useMemo(() => getKnowledge(customer), [customer]);
  const pricing = useMemo(() => getPricing(customer), [customer]);

  const pdfItems: ParsedLineItem[] | null = useMemo(
    () => (pdfText ? parsePdfToItems(pdfText, customer) : null),
    [pdfText, customer]
  );

  const fillSample = () => {
    setMode("paste");
    setSubject("new order");
    setFrom("Marisa <marisa@bystokkeholm.no>");
    setCustomer("By Stokkeholm");
    setBody(SAMPLE_EMAIL);
  };

  const reset = () => {
    setResult(null);
    setStep(0);
  };

  const handleExcelFile = async (file: File | undefined) => {
    if (!file) return;
    setExcelFile(file);
    setExcelParse(null);
    setExcelError(null);
    setExcelLoading(true);
    try {
      const parsed = await parseExcelFile(file);
      setExcelParse(parsed);
      if (parsed.items.length === 0) {
        setExcelError("No recognizable order rows found — check that the sheet has a header row with style/item numbers.");
      }
    } catch {
      setExcelError("Couldn't read that file. Make sure it's a valid .xlsx or .xls workbook.");
    } finally {
      setExcelLoading(false);
    }
  };

  const handlePdfFile = async (file: File | undefined) => {
    if (!file) return;
    setPdfFile(file);
    setPdfText(null);
    setPdfError(null);
    setPdfLoading(true);
    try {
      const text = await extractPdfText(file);
      setPdfText(text);
    } catch {
      setPdfError("Couldn't extract text from that PDF — it may be a scanned image without a text layer.");
    } finally {
      setPdfLoading(false);
    }
  };

  const canProcess =
    (mode === "paste" && body.trim().length > 0) ||
    (mode === "excel" && (excelParse?.items.length ?? 0) > 0) ||
    (mode === "pdf" && (pdfItems?.length ?? 0) > 0);

  const processRequest = () => {
    if (!canProcess) return;
    setResult(null);
    setProcessing(true);
    setStep(0);

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setStep(i);
      if (i >= PROCESSING_STEPS.length) {
        clearInterval(interval);

        let items: ParsedLineItem[] = [];
        let rawContent = "";
        let effectiveSubject = subject;
        let effectiveFrom = from;

        if (mode === "paste") {
          items = parseEmailToItems(body, customer);
          rawContent = body;
        } else if (mode === "excel" && excelParse && excelFile) {
          items = excelParse.items;
          rawContent = `Imported from ${excelFile.name} — sheet "${excelParse.sheetName}", ${excelParse.rowCount} data row${excelParse.rowCount === 1 ? "" : "s"}.\n\n${items.map((it) => it.raw).join("\n")}`;
          effectiveSubject = subject || `Excel import — ${excelFile.name}`;
          effectiveFrom = from || "Excel import";
        } else if (mode === "pdf" && pdfItems && pdfFile) {
          items = pdfItems;
          rawContent = pdfText ?? "";
          effectiveSubject = subject || `PDF import — ${pdfFile.name}`;
          effectiveFrom = from || "PDF import";
        }

        const request = buildLiveRequest({
          customer,
          subject: effectiveSubject,
          from: effectiveFrom,
          rawContent,
          items,
        });
        setResult(request);
        setProcessing(false);
      }
    }, 450);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Attach the customer request</CardTitle>
          <CardDescription>
            Paste an email, or import an Excel/PDF file the customer sent. Estrella&apos;s Autopilot
            reads it the same way for any customer, then applies that customer&apos;s known
            terminology, pricing and confirmed design mappings.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 sm:w-64">
            <Label>Customer</Label>
            <Select value={customer} onValueChange={setCustomer}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {customerKnowledge.map((k) => (
                  <SelectItem key={k.customer} value={k.customer}>
                    {k.customer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-brand-brown/45 text-xs">
              Determines which terminology, pricing and confirmed mappings apply.
            </p>
          </div>

          <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
            <TabsList>
              <TabsTrigger value="paste">
                <Mail className="size-3.5" /> Paste Email
              </TabsTrigger>
              <TabsTrigger value="excel">
                <FileSpreadsheet className="size-3.5" /> Import Excel
              </TabsTrigger>
              <TabsTrigger value="pdf">
                <FileText className="size-3.5" /> Import PDF
              </TabsTrigger>
            </TabsList>

            <TabsContent value="paste" className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label>From</Label>
                  <Input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="name@customer.com" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Subject</Label>
                  <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="new order" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label>Email body</Label>
                  <button
                    type="button"
                    onClick={fillSample}
                    className="text-brand-brown/50 hover:text-brand-brown text-xs font-medium"
                  >
                    Use sample email
                  </button>
                </div>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={10}
                  placeholder="Paste the customer's email here..."
                  className="font-sans"
                />
              </div>
            </TabsContent>

            <TabsContent value="excel" className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label>Label (optional)</Label>
                  <Input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="e.g. Diara ops team" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Subject (optional)</Label>
                  <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Defaults to the filename" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Excel file (.xlsx, .xls)</Label>
                <Input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => handleExcelFile(e.target.files?.[0])}
                />
                <p className="text-brand-brown/45 text-xs">
                  Reads the first sheet, finds the header row, and matches columns like Item No.,
                  Artikelnummer, Material, Carat, Qty and Price — whatever names the sheet uses.
                </p>
              </div>

              {excelLoading && (
                <p className="text-brand-brown/60 flex items-center gap-2 text-sm">
                  <Loader2 className="size-4 animate-spin" /> Reading workbook…
                </p>
              )}
              {excelError && <p className="text-destructive text-sm">{excelError}</p>}
              {excelParse && excelParse.items.length > 0 && (
                <div className="rounded-xl border border-border/50 bg-white/50 p-4">
                  <p className="text-sm font-medium text-brand-brown">
                    Found {excelParse.items.length} row{excelParse.items.length === 1 ? "" : "s"} in
                    sheet &ldquo;{excelParse.sheetName}&rdquo;
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {excelParse.matchedColumns.map((col) => (
                      <Badge key={col} variant="outline">
                        {COLUMN_LABELS[col] ?? col}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="pdf" className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label>Label (optional)</Label>
                  <Input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="e.g. customer@example.com" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Subject (optional)</Label>
                  <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Defaults to the filename" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>PDF file</Label>
                <Input type="file" accept=".pdf" onChange={(e) => handlePdfFile(e.target.files?.[0])} />
                <p className="text-brand-brown/45 text-xs">
                  Extracts the PDF&apos;s text and reads it the same way as a pasted email. Scanned
                  PDFs without a text layer won&apos;t extract — paste the text instead.
                </p>
              </div>

              {pdfLoading && (
                <p className="text-brand-brown/60 flex items-center gap-2 text-sm">
                  <Loader2 className="size-4 animate-spin" /> Extracting text…
                </p>
              )}
              {pdfError && <p className="text-destructive text-sm">{pdfError}</p>}
              {pdfText && (
                <div className="rounded-xl border border-border/50 bg-white/50 p-4">
                  <p className="text-sm font-medium text-brand-brown">
                    Found {pdfItems?.length ?? 0} item{pdfItems?.length === 1 ? "" : "s"} in the
                    extracted text
                  </p>
                  <pre className="text-brand-brown/60 mt-2 max-h-32 overflow-y-auto font-sans text-xs whitespace-pre-wrap">
                    {pdfText.slice(0, 600)}
                    {pdfText.length > 600 ? "…" : ""}
                  </pre>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex items-center gap-3 border-t border-border/50 pt-4">
            <Button onClick={processRequest} disabled={!canProcess || processing}>
              {processing ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Processing…
                </>
              ) : (
                <>
                  {mode === "paste" ? <Sparkles className="size-4" /> : <Upload className="size-4" />}
                  {mode === "paste" ? "Process Email" : "Process Import"}
                </>
              )}
            </Button>
            {result && !processing && (
              <Button variant="ghost" onClick={reset}>
                <RotateCcw className="size-4" /> Start Over
              </Button>
            )}
          </div>

          {(processing || result) && (
            <div className="flex flex-wrap gap-2 border-t border-border/50 pt-4">
              {PROCESSING_STEPS.map((label, i) => {
                const done = i < step || (!processing && result);
                const active = processing && i === step;
                return (
                  <span
                    key={label}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200",
                      done
                        ? "border-success/30 bg-success/10 text-success"
                        : active
                          ? "border-accent/40 bg-accent/10 text-brand-brown"
                          : "border-brand-brown/10 text-brand-brown/40"
                    )}
                  >
                    {done ? (
                      <Check className="size-3" />
                    ) : active ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : null}
                    {label}
                  </span>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <>
          <Card className="border-success/30">
            <CardContent className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="success">
                  <Check className="size-3" /> AI extraction complete
                </Badge>
                <p className="text-brand-brown/65 text-sm">
                  Found {result.items.length} item{result.items.length === 1 ? "" : "s"} for{" "}
                  <span className="font-medium text-brand-brown">{result.customer}</span>. Review
                  every step below before anything is finalized.
                </p>
              </div>
              {!knowledge && (
                <Badge variant="warning">No Customer Knowledge profile yet for {customer}</Badge>
              )}
              {!pricing && (
                <Badge variant="warning">No pricing profile found for {customer}</Badge>
              )}
            </CardContent>
          </Card>

          <OrderWorkspace request={result} pricing={pricing} knowledge={knowledge} />

          <div id="export-anchor">
            <Card className="mb-5">
              <CardHeader>
                <CardTitle>Export / Final Output</CardTitle>
                <CardDescription>
                  Same export step as a queued request — prepared automatically from what was
                  confirmed above.
                </CardDescription>
              </CardHeader>
            </Card>
            <ExportPanel request={result} currencyCode={pricing?.currency ?? "INR"} />
          </div>
        </>
      )}
    </div>
  );
}
