"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Search, ArrowRight } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  exceptions,
  secondaryPlatinumPricing,
} from "@/lib/furqan-desk/mock-data";

export function ExceptionsClient() {
  const [platinumOpen, setPlatinumOpen] = useState<Record<number, boolean>>({});
  const [terminologyChoice, setTerminologyChoice] = useState<Record<number, string>>({});

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-brand-brown/55 mb-3 text-xs font-semibold tracking-[0.12em] uppercase">
          Missing Internal Design
        </h2>
        <div className="flex flex-col gap-3">
          {exceptions.missingDesign.map((ex) => (
            <Card key={ex.customerStyle}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-brand-brown">
                    {ex.customer} · Customer Style {ex.customerStyle}
                  </p>
                  <Badge variant="destructive" className="mt-1.5">
                    {ex.status}
                  </Badge>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/furqan-desk/requests/${ex.requestId}`}>
                    <Search className="size-3.5" /> Find Manually
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-brand-brown/55 mb-3 text-xs font-semibold tracking-[0.12em] uppercase">
          Missing Pricing
        </h2>
        <div className="flex flex-col gap-3">
          {exceptions.missingPricing.map((ex, i) => (
            <Card key={`${ex.customer}-${ex.product}`}>
              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-brand-brown">
                      {ex.customer} · {ex.product}
                    </p>
                    <Badge variant="destructive" className="mt-1.5">
                      {ex.status}
                    </Badge>
                  </div>
                  {!platinumOpen[i] && (
                    <Button size="sm" variant="outline" onClick={() => setPlatinumOpen((p) => ({ ...p, [i]: true }))}>
                      Check Secondary Pricing
                    </Button>
                  )}
                </div>
                {platinumOpen[i] && (
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
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-brand-brown/55 mb-3 text-xs font-semibold tracking-[0.12em] uppercase">
          Ambiguous Terminology
        </h2>
        <div className="flex flex-col gap-3">
          {exceptions.ambiguousTerminology.map((ex, i) => (
            <Card key={ex.term}>
              <CardHeader>
                <CardTitle className="text-base">
                  {ex.customer} wrote: <span className="font-mono">&ldquo;{ex.term}&rdquo;</span>
                </CardTitle>
                <CardDescription>Possible meanings — confirm which one applies here.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-2">
                {ex.possibleMeanings.map((meaning) => (
                  <Button
                    key={meaning}
                    size="sm"
                    variant={terminologyChoice[i] === meaning ? "default" : "outline"}
                    onClick={() => {
                      setTerminologyChoice((p) => ({ ...p, [i]: meaning }));
                      toast.success(`Saved to Customer Knowledge: "${ex.term}" → ${meaning}`);
                    }}
                  >
                    {meaning}
                  </Button>
                ))}
                {terminologyChoice[i] && (
                  <Badge variant="success" className="ml-2">
                    Confirmed: {ex.term} → {terminologyChoice[i]}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Link
        href="/furqan-desk/knowledge"
        className="text-brand-brown/60 hover:text-brand-brown inline-flex w-fit items-center gap-1 text-sm font-medium"
      >
        View Customer Knowledge <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}
