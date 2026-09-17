"use client";

import { useMemo, useState } from "react";
import { Loader2, Check, Sparkles, RotateCcw } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { buildLiveRequest } from "@/lib/furqan-desk/parse-email";

const PROCESSING_STEPS = [
  "Reading the email",
  "Extracting order details",
  "Understanding customer terminology",
  "Matching internal designs",
  "Fetching customer pricing",
];

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
  const [customer, setCustomer] = useState(customerKnowledge[0].customer);
  const [subject, setSubject] = useState("");
  const [from, setFrom] = useState("");
  const [body, setBody] = useState("");
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<CustomerRequest | null>(null);

  const knowledge = useMemo(() => getKnowledge(customer), [customer]);
  const pricing = useMemo(() => getPricing(customer), [customer]);

  const fillSample = () => {
    setSubject("new order");
    setFrom("Marisa <marisa@bystokkeholm.no>");
    setCustomer("By Stokkeholm");
    setBody(SAMPLE_EMAIL);
  };

  const reset = () => {
    setResult(null);
    setStep(0);
  };

  const processEmail = () => {
    if (!body.trim()) return;
    setResult(null);
    setProcessing(true);
    setStep(0);

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setStep(i);
      if (i >= PROCESSING_STEPS.length) {
        clearInterval(interval);
        const request = buildLiveRequest({ customer, subject, from, body });
        setResult(request);
        setProcessing(false);
      }
    }, 450);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Attach the customer email</CardTitle>
          <CardDescription>
            Paste the email as received — subject, sender and body. Estrella&apos;s Autopilot reads it the
            same way for any customer, then applies that customer&apos;s known terminology, pricing
            and confirmed design mappings.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
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

          <div className="flex items-center gap-3">
            <Button onClick={processEmail} disabled={!body.trim() || processing}>
              {processing ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Processing…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" /> Process Email
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
