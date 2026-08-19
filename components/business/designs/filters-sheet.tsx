"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

export type GalleryFilters = {
  minWeight: number | null;
  maxWeight: number | null;
  diamondQualities: string[];
  colorstones: string[];
  minCts: number | null;
  maxCts: number | null;
  newArrivalsOnly: boolean;
  hasColorstoneOnly: boolean;
};

export const EMPTY_FILTERS: GalleryFilters = {
  minWeight: null,
  maxWeight: null,
  diamondQualities: [],
  colorstones: [],
  minCts: null,
  maxCts: null,
  newArrivalsOnly: false,
  hasColorstoneOnly: false,
};

const DIAMOND_QUALITIES = ["SI-I1", "VS-SI", "VVS-VS"];
const COLORSTONES = ["No Stone", "Ruby", "Emerald", "Sapphire"];

export function FiltersSheet({
  open,
  onOpenChange,
  filters,
  onApply,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: GalleryFilters;
  onApply: (filters: GalleryFilters) => void;
}) {
  const [draft, setDraft] = useState<GalleryFilters>(filters);

  function toggleInArray(key: "diamondQualities" | "colorstones", value: string) {
    setDraft((prev) => {
      const set = new Set(prev[key]);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...prev, [key]: Array.from(set) };
    });
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (next) setDraft(filters);
        onOpenChange(next);
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filters options</SheetTitle>
          <SheetDescription>Narrow the archive down to what you need.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6">
          <Accordion type="multiple" defaultValue={["weight"]}>
            <AccordionItem value="weight">
              <AccordionTrigger>Weight & Measurement</AccordionTrigger>
              <AccordionContent>
                <p className="text-brand-brown/55 mb-2 text-xs">Base weight range, in gms.</p>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min={0}
                    step={0.1}
                    placeholder="Min"
                    value={draft.minWeight ?? ""}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        minWeight: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                  />
                  <span className="text-brand-brown/40 text-sm">—</span>
                  <Input
                    type="number"
                    min={0}
                    step={0.1}
                    placeholder="Max"
                    value={draft.maxWeight ?? ""}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        maxWeight: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="stone-info">
              <AccordionTrigger>Stone Information</AccordionTrigger>
              <AccordionContent>
                <p className="text-brand-brown/55 mb-2 text-xs">Diamond quality</p>
                <div className="flex flex-col gap-2">
                  {DIAMOND_QUALITIES.map((q) => (
                    <label key={q} className="flex items-center gap-2.5 text-sm">
                      <Checkbox
                        checked={draft.diamondQualities.includes(q)}
                        onCheckedChange={() => toggleInArray("diamondQualities", q)}
                      />
                      {q}
                    </label>
                  ))}
                </div>
                <p className="text-brand-brown/55 mt-4 mb-2 text-xs">Colorstone</p>
                <div className="flex flex-col gap-2">
                  {COLORSTONES.map((c) => (
                    <label key={c} className="flex items-center gap-2.5 text-sm">
                      <Checkbox
                        checked={draft.colorstones.includes(c)}
                        onCheckedChange={() => toggleInArray("colorstones", c)}
                      />
                      {c}
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="shapes-sizes">
              <AccordionTrigger>Stone Shapes & Sizes</AccordionTrigger>
              <AccordionContent>
                <p className="text-brand-brown/55 mb-2 text-xs">Diamond size range, in cts.</p>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min={0}
                    step={0.05}
                    placeholder="Min"
                    value={draft.minCts ?? ""}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        minCts: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                  />
                  <span className="text-brand-brown/40 text-sm">—</span>
                  <Input
                    type="number"
                    min={0}
                    step={0.05}
                    placeholder="Max"
                    value={draft.maxCts ?? ""}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        maxCts: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="additional">
              <AccordionTrigger>Additional Options</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center justify-between py-1.5">
                  <Label htmlFor="new-arrivals-only" className="text-sm font-normal">
                    New arrivals only
                  </Label>
                  <Switch
                    id="new-arrivals-only"
                    checked={draft.newArrivalsOnly}
                    onCheckedChange={(v) => setDraft((p) => ({ ...p, newArrivalsOnly: v }))}
                  />
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <Label htmlFor="has-colorstone" className="text-sm font-normal">
                    Has colorstone
                  </Label>
                  <Switch
                    id="has-colorstone"
                    checked={draft.hasColorstoneOnly}
                    onCheckedChange={(v) => setDraft((p) => ({ ...p, hasColorstoneOnly: v }))}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <SheetFooter className="flex-row justify-between border-t border-border/50 pt-4">
          <Button
            variant="ghost"
            onClick={() => {
              setDraft(EMPTY_FILTERS);
              onApply(EMPTY_FILTERS);
            }}
          >
            Reset Filter
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                onApply(draft);
                toast.success("Filter saved for this session");
              }}
            >
              Save Filter
            </Button>
            <Button
              onClick={() => {
                onApply(draft);
                onOpenChange(false);
              }}
            >
              Apply
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
