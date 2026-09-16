"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle2, Search, ArrowRight, Sparkles } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { PhotoPlaceholder } from "@/components/brand/photo-placeholder";
import { ConfidenceBadge, confidenceAction } from "@/components/furqan-desk/confidence-badge";
import { AuditTag } from "@/components/furqan-desk/audit-tag";
import { cn } from "@/lib/utils";
import {
  currency,
  jemrData,
  secondaryPlatinumPricing,
  type CustomerRequest,
  type CustomerPricing,
  type CustomerKnowledge,
  type FieldAudit,
} from "@/lib/furqan-desk/mock-data";

type EditableField = "internalDesign" | "diamondWeight" | "quantity" | "metal" | "size" | "customerReference" | "value";

interface ItemState {
  matchDecision: "pending" | "confirmed" | "rejected";
  fields: {
    internalDesign: string;
    diamondWeight: string;
    quantity: number;
    metal: string;
    size: string;
    customerReference: string;
    value: number | null;
  };
  audit: Record<EditableField, FieldAudit>;
}

function initialState(request: CustomerRequest): Record<string, ItemState> {
  const state: Record<string, ItemState> = {};
  for (const item of request.items) {
    state[item.id] = {
      matchDecision: "pending",
      fields: {
        internalDesign: item.internalDesign ?? "",
        diamondWeight: item.diamondWeight ?? "",
        quantity: item.quantity,
        metal: item.metal,
        size: item.size,
        customerReference: item.customerReference,
        value: item.value,
      },
      audit: { ...item.fieldAudit } as Record<EditableField, FieldAudit>,
    };
  }
  return state;
}

export function OrderWorkspace({
  request,
  pricing,
  knowledge,
}: {
  request: CustomerRequest;
  pricing: CustomerPricing | undefined;
  knowledge: CustomerKnowledge | undefined;
}) {
  const [items, setItems] = useState<Record<string, ItemState>>(() => initialState(request));
  const [showSecondaryPlatinum, setShowSecondaryPlatinum] = useState(false);

  const needsPlatinum = request.items.some((i) => i.metal === "Platinum");
  const primaryHasPlatinum = Boolean(pricing?.platinum);

  const updateField = (itemId: string, field: EditableField, value: string | number | null) => {
    setItems((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        fields: { ...prev[itemId].fields, [field]: value },
        audit: { ...prev[itemId].audit, [field]: "human" },
      },
    }));
  };

  const decideMatch = (itemId: string, decision: ItemState["matchDecision"]) => {
    setItems((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], matchDecision: decision },
    }));
  };

  const totals = useMemo(() => {
    return request.items.reduce(
      (acc, item) => {
        const value = items[item.id]?.fields.value ?? 0;
        const qty = items[item.id]?.fields.quantity ?? item.quantity;
        acc.value += value ?? 0;
        acc.total += (value ?? 0) * qty;
        return acc;
      },
      { value: 0, total: 0 }
    );
  }, [items, request.items]);

  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-brand-brown/55 text-xs font-semibold tracking-[0.1em] uppercase">
            Order Workspace
          </p>
          <h1 className="font-heading mt-1 text-4xl font-semibold text-brand-brown">
            {request.customer}
          </h1>
          <p className="text-brand-brown/60 mt-1.5 text-sm">{request.subject} · received {request.receivedAt}</p>
        </div>
        <Button asChild variant="accent">
          <Link href={`/furqan-desk/requests/${request.id}/export`}>
            Go to Export <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="parser">
        <TabsList>
          <TabsTrigger value="parser">Request Parser</TabsTrigger>
          <TabsTrigger value="matching">Design &amp; Image Matching</TabsTrigger>
          <TabsTrigger value="pricing">Pricing &amp; JEMR</TabsTrigger>
          <TabsTrigger value="workspace">Order Table</TabsTrigger>
          <TabsTrigger value="verification">Human Verification</TabsTrigger>
        </TabsList>

        {/* ------------------------------------------------------------ */}
        {/* 6. Customer Request Parser                                    */}
        {/* ------------------------------------------------------------ */}
        <TabsContent value="parser">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mail className="text-brand-brown/50 size-4" />
                  <CardTitle className="text-base">Original Customer Email</CardTitle>
                </div>
                <CardDescription>
                  From {request.from} · {request.receivedAt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-border/50 bg-white/50 p-4">
                  <p className="text-brand-brown/80 text-sm font-semibold">Subject: {request.subject}</p>
                  <pre className="text-brand-brown/75 mt-3 font-sans text-sm whitespace-pre-wrap">
                    {request.emailBody}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-brand-brown/50 size-4" />
                    <CardTitle className="text-base">AI Extracted Information</CardTitle>
                  </div>
                  <Badge variant="success">
                    <CheckCircle2 className="size-3" /> AI extraction complete
                  </Badge>
                </div>
                <CardDescription>
                  Review each field below — extraction is AI-assisted, not guaranteed correct.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {request.items.map((item, idx) => (
                  <div key={item.id} className="rounded-xl border border-border/50 bg-white/50 p-4">
                    <p className="text-brand-brown/50 mb-2 text-xs font-semibold tracking-wide uppercase">
                      Item {idx + 1}
                    </p>
                    <Table>
                      <TableBody>
                        {[
                          ["Customer", request.customer],
                          ["Style No.", item.customerStyleNo],
                          ["Quantity", String(item.quantity)],
                          ["Diamond Wt", item.diamondWeight ?? "— (not provided)"],
                          ["Metal", item.metal],
                          ["Size", item.size],
                          ["Customer Ref", item.customerReference],
                        ].map(([field, value]) => (
                          <TableRow key={field}>
                            <TableCell className="text-brand-brown/55 w-32 py-1.5 text-xs font-medium uppercase">
                              {field}
                            </TableCell>
                            <TableCell className="py-1.5 text-sm font-medium text-brand-brown">
                              {value}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ------------------------------------------------------------ */}
        {/* 7/8. Design matching + image matching                        */}
        {/* ------------------------------------------------------------ */}
        <TabsContent value="matching">
          <div className="flex flex-col gap-5">
            {request.items.map((item) => {
              const state = items[item.id];
              return (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        Customer Reference: {item.customerStyleNo}
                      </CardTitle>
                      <ConfidenceBadge level={item.confidence} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_1fr_1.2fr]">
                      <div>
                        <p className="text-brand-brown/50 mb-1.5 text-xs font-semibold tracking-wide uppercase">
                          Customer Reference Image
                        </p>
                        <div className="relative aspect-square overflow-hidden rounded-lg border border-border/50">
                          <PhotoPlaceholder variant={item.imageVariant} />
                        </div>
                      </div>
                      <div>
                        <p className="text-brand-brown/50 mb-1.5 text-xs font-semibold tracking-wide uppercase">
                          Possible Internal Match
                        </p>
                        <div className="relative aspect-square overflow-hidden rounded-lg border border-border/50">
                          <PhotoPlaceholder
                            variant={item.internalDesign ? item.imageVariant : "noir"}
                          />
                        </div>
                        <p className="mt-1.5 text-sm font-semibold text-brand-brown">
                          {item.internalDesign ?? "No confident match found"}
                        </p>
                        {item.internalDesign && (
                          <Badge variant="gold" className="mt-1">
                            Potential Match Detected
                          </Badge>
                        )}
                      </div>
                      <div>
                        <p className="text-brand-brown/50 mb-1.5 text-xs font-semibold tracking-wide uppercase">
                          Match Reason
                        </p>
                        <ul className="text-brand-brown/75 flex flex-col gap-1 text-sm">
                          {item.matchReasons.map((r) => (
                            <li key={r} className="flex gap-1.5">
                              <span className="text-brand-brown/40">•</span>
                              {r}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {item.confidence !== "low" && (
                            <Button
                              size="sm"
                              variant={state.matchDecision === "confirmed" ? "default" : "outline"}
                              onClick={() => decideMatch(item.id, "confirmed")}
                            >
                              {confidenceAction(item.confidence)}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant={state.matchDecision === "rejected" ? "destructive" : "outline"}
                            onClick={() => decideMatch(item.id, "rejected")}
                          >
                            Reject Match
                          </Button>
                          {state.matchDecision === "pending" && item.confidence === "low" && (
                            <Link
                              href="/furqan-desk/exceptions"
                              className="text-brand-brown/60 hover:text-brand-brown inline-flex items-center gap-1 text-xs font-medium"
                            >
                              <Search className="size-3.5" /> Find manually in Exceptions
                            </Link>
                          )}
                          {state.matchDecision !== "pending" && (
                            <Badge variant={state.matchDecision === "confirmed" ? "success" : "destructive"}>
                              {state.matchDecision === "confirmed" ? "Match confirmed" : "Match rejected"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ------------------------------------------------------------ */}
        {/* 9/10/11. Pricing + Platinum rule + JEMR                       */}
        {/* ------------------------------------------------------------ */}
        <TabsContent value="pricing">
          <div className="flex flex-col gap-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Customer Pricing Knowledge</CardTitle>
                <CardDescription>
                  {request.customer} → applicable pricing → this order. Pricing is customer-specific,
                  retrieved fresh for the current order rather than treated as a fixed global rate.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pricing ? (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                    {[
                      ["Labour / JEMR", pricing.labour],
                      ["Diamond", pricing.diamond],
                      ["Lab Diamond", pricing.labDiamond],
                      ["Color Stone", pricing.colorStone],
                      ["Metal", pricing.metal],
                      ["Platinum", pricing.platinum ?? "Not available in primary source"],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-brand-brown/50 text-xs font-semibold tracking-wide uppercase">
                          {label}
                        </p>
                        <p
                          className={cn(
                            "mt-0.5 text-sm font-medium",
                            label === "Platinum" && !pricing.platinum
                              ? "text-destructive"
                              : "text-brand-brown"
                          )}
                        >
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-brand-brown/60 text-sm">No pricing profile found for this customer.</p>
                )}
              </CardContent>
            </Card>

            {needsPlatinum && !primaryHasPlatinum && (
              <Card className="border-warning/40">
                <CardHeader>
                  <CardTitle className="text-base">Platinum Pricing</CardTitle>
                  <CardDescription className="text-warning font-medium">
                    Platinum pricing not available in primary source.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {!showSecondaryPlatinum ? (
                    <Button size="sm" variant="outline" onClick={() => setShowSecondaryPlatinum(true)}>
                      Check Platinum Pricing
                    </Button>
                  ) : (
                    <div className="rounded-xl border border-border/50 bg-white/50 p-4">
                      <p className="text-brand-brown/50 text-xs font-semibold tracking-wide uppercase">
                        {secondaryPlatinumPricing.source}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-brand-brown">
                        {secondaryPlatinumPricing.rate}
                      </p>
                      <p className="text-brand-brown/55 mt-1 text-xs">
                        Last updated {secondaryPlatinumPricing.lastUpdated}. {secondaryPlatinumPricing.note}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">JEMR Data (mock)</CardTitle>
                <CardDescription>
                  Brought into this workspace instead of opening JEMR separately.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Design No.</TableHead>
                      <TableHead>Metal</TableHead>
                      <TableHead>KT</TableHead>
                      <TableHead>Metal Wt</TableHead>
                      <TableHead>Diamond Wt</TableHead>
                      <TableHead>Color Stone Wt</TableHead>
                      <TableHead>Current Pricing</TableHead>
                      <TableHead>Other</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {request.items
                      .map((i) => i.internalDesign)
                      .filter((d): d is string => Boolean(d))
                      .filter((d, i, arr) => arr.indexOf(d) === i)
                      .map((designNo) => {
                        const record = jemrData[designNo];
                        if (!record) return null;
                        return (
                          <TableRow key={designNo}>
                            <TableCell className="font-medium text-brand-brown">{record.designNo}</TableCell>
                            <TableCell>{record.metal}</TableCell>
                            <TableCell>{record.kt}</TableCell>
                            <TableCell>{record.metalWeight}</TableCell>
                            <TableCell>{record.diamondWeight}</TableCell>
                            <TableCell>{record.colorStoneWeight}</TableCell>
                            <TableCell>{record.currentPricing}</TableCell>
                            <TableCell className="text-brand-brown/60 text-xs">{record.other}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {knowledge && (
              <p className="text-brand-brown/50 text-xs">
                Reminder: quantity, metal, weight, size and reference above are read fresh from this
                order. Only style mappings and pricing structure come from Customer Knowledge.
              </p>
            )}
          </div>
        </TabsContent>

        {/* ------------------------------------------------------------ */}
        {/* 13/14. Order table with value/total                          */}
        {/* ------------------------------------------------------------ */}
        <TabsContent value="workspace">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Items</CardTitle>
              <CardDescription>Value × Quantity = Total Value.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Style</TableHead>
                    <TableHead>Internal Design</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Diamond Wt</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead>Metal</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead className="text-right">Total Value</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {request.items.map((item) => {
                    const state = items[item.id];
                    const value = state.fields.value;
                    const qty = state.fields.quantity;
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-brand-brown">{item.customerStyleNo}</TableCell>
                        <TableCell>{state.fields.internalDesign || "—"}</TableCell>
                        <TableCell>
                          <div className="relative size-10 overflow-hidden rounded-md border border-border/50">
                            <PhotoPlaceholder variant={item.imageVariant} />
                          </div>
                        </TableCell>
                        <TableCell>{state.fields.diamondWeight || "—"}</TableCell>
                        <TableCell className="text-right">{qty}</TableCell>
                        <TableCell>{state.fields.metal}</TableCell>
                        <TableCell>{state.fields.size}</TableCell>
                        <TableCell className="text-right">{value != null ? currency(value) : "—"}</TableCell>
                        <TableCell className="text-right font-medium">
                          {value != null ? currency(value * qty) : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.status === "Ready for Review" ? "success" : "warning"}>
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <div className="mt-4 flex justify-end gap-8 border-t border-border/50 pt-4">
                <div className="text-right">
                  <p className="text-brand-brown/50 text-xs font-semibold tracking-wide uppercase">
                    Order Total
                  </p>
                  <p className="font-heading text-2xl font-semibold text-brand-brown">
                    {currency(totals.total)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------ */}
        {/* 15/16. Human verification                                    */}
        {/* ------------------------------------------------------------ */}
        <TabsContent value="verification">
          <div className="flex flex-col gap-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Human Verification Required</CardTitle>
                <CardDescription>
                  Edit any field below. Manually changed fields are marked{" "}
                  <span className="text-success font-medium">Human Updated</span>; everything else stays{" "}
                  <span className="font-medium">AI Suggested</span> until you change it.
                </CardDescription>
              </CardHeader>
            </Card>

            {request.items.map((item) => {
              const state = items[item.id];
              const fieldRows: { key: EditableField; label: string }[] = [
                { key: "internalDesign", label: "Internal Design" },
                { key: "diamondWeight", label: "Diamond Weight" },
                { key: "quantity", label: "Quantity" },
                { key: "metal", label: "Metal" },
                { key: "size", label: "Size" },
                { key: "customerReference", label: "Customer Reference" },
                { key: "value", label: "Value" },
              ];

              return (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{item.customerStyleNo}</CardTitle>
                      <ConfidenceBadge level={item.confidence} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {fieldRows.map(({ key, label }) => (
                        <div key={key} className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-brand-brown/55 text-xs font-semibold tracking-wide uppercase">
                              {label}
                            </label>
                            <AuditTag source={state.audit[key]} />
                          </div>
                          <Input
                            value={
                              key === "value"
                                ? (state.fields.value ?? "")
                                : (state.fields[key] as string | number)
                            }
                            type={key === "quantity" || key === "value" ? "number" : "text"}
                            onChange={(e) => {
                              const raw = e.target.value;
                              const parsed =
                                key === "quantity" || key === "value"
                                  ? raw === ""
                                    ? null
                                    : Number(raw)
                                  : raw;
                              updateField(item.id, key, parsed);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <div className="flex justify-end">
              <Button asChild variant="accent">
                <Link href={`/furqan-desk/requests/${request.id}/export`}>
                  Confirm &amp; Continue to Export <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
