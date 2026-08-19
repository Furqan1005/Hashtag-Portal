"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DesignCard } from "@/components/business/designs/design-card";
import { FiltersSheet, EMPTY_FILTERS, type GalleryFilters } from "@/components/business/designs/filters-sheet";
import { addDesignToSelection } from "@/lib/data/selections";
import type { DesignWithVariants } from "@/lib/data/designs";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "all", label: "All Designs" },
  { value: "bangle", label: "Bangle" },
  { value: "bracelet", label: "Bracelet" },
  { value: "earring", label: "Earring" },
  { value: "necklace", label: "Necklace" },
  { value: "nosepin", label: "Nosepin" },
  { value: "pendant", label: "Pendant" },
  { value: "ring", label: "Ring" },
] as const;

const ATTRIBUTE_TAGS = [
  "2 Stone",
  "3 Stone",
  "4 Prong",
  "Bezel",
  "Chain",
  "Channel",
  "Classic",
  "Cluster",
  "Eternity",
  "Halo",
  "Pave",
  "Solitaire",
];

type VariantSelection = { metal: string | null; diamond: string | null; colorstone: string | null };

export function DesignGalleryClient({
  designs,
  initialSelectedDesignIds,
  initialSelectionCount,
}: {
  designs: DesignWithVariants[];
  initialSelectedDesignIds: string[];
  initialSelectionCount: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [tab, setTab] = useState<"estrella" | "exclusive">("estrella");
  const [category, setCategory] = useState<string>("all");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<GalleryFilters>(EMPTY_FILTERS);
  const [showPricing, setShowPricing] = useState(false);

  const [globalMetalLabel, setGlobalMetalLabel] = useState<string | null>(null);
  const [globalDiamondLabel, setGlobalDiamondLabel] = useState<string | null>(null);
  const [globalColorstoneLabel, setGlobalColorstoneLabel] = useState<string | null>(null);

  const [variantSelections, setVariantSelections] = useState<Record<string, VariantSelection>>(
    () => {
      const initial: Record<string, VariantSelection> = {};
      for (const d of designs) {
        initial[d.id] = {
          metal: d.metalOptions.find((v) => v.is_default)?.id ?? d.metalOptions[0]?.id ?? null,
          diamond:
            d.diamondOptions.find((v) => v.is_default)?.id ?? d.diamondOptions[0]?.id ?? null,
          colorstone:
            d.colorstoneOptions.find((v) => v.is_default)?.id ?? d.colorstoneOptions[0]?.id ?? null,
        };
      }
      return initial;
    }
  );

  const [selectedDesignIds, setSelectedDesignIds] = useState<Set<string>>(
    new Set(initialSelectedDesignIds)
  );
  const [selectionCount, setSelectionCount] = useState(initialSelectionCount);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: designs.length };
    for (const d of designs) c[d.category] = (c[d.category] ?? 0) + 1;
    return c;
  }, [designs]);

  const filteredDesigns = useMemo(() => {
    return designs.filter((d) => {
      if (d.design_type !== tab) return false;
      if (category !== "all" && d.category !== category) return false;
      if (activeTags.length && !activeTags.some((t) => d.attribute_tags.includes(t))) return false;

      if (filters.minWeight != null && d.base_weight_gms < filters.minWeight) return false;
      if (filters.maxWeight != null && d.base_weight_gms > filters.maxWeight) return false;
      if (filters.newArrivalsOnly && !d.is_new_arrival) return false;

      if (filters.diamondQualities.length) {
        const hasQuality = d.diamondOptions.some((v) =>
          filters.diamondQualities.includes(v.label)
        );
        if (!hasQuality) return false;
      }
      if (filters.colorstones.length) {
        const hasStone = d.colorstoneOptions.some((v) => filters.colorstones.includes(v.label));
        if (!hasStone) return false;
      }
      if (filters.hasColorstoneOnly) {
        const hasRealStone = d.colorstoneOptions.some(
          (v) => v.label !== "No Stone" && v.price_modifier > 0
        );
        if (!hasRealStone) return false;
      }
      if (filters.minCts != null || filters.maxCts != null) {
        const inRange = d.diamondOptions.some((v) => {
          if (filters.minCts != null && v.weight < filters.minCts) return false;
          if (filters.maxCts != null && v.weight > filters.maxCts) return false;
          return true;
        });
        if (!inRange) return false;
      }

      return true;
    });
  }, [designs, tab, category, activeTags, filters]);

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleVariantChange(designId: string, kind: "metal" | "diamond" | "colorstone", variantId: string) {
    setVariantSelections((prev) => ({
      ...prev,
      [designId]: { ...prev[designId], [kind]: variantId },
    }));
  }

  function applyGlobalPricing() {
    setVariantSelections((prev) => {
      const next = { ...prev };
      for (const d of filteredDesigns) {
        const metal = globalMetalLabel
          ? d.metalOptions.find((v) => v.label === globalMetalLabel)
          : null;
        const diamond = globalDiamondLabel
          ? d.diamondOptions.find((v) => v.label === globalDiamondLabel)
          : null;
        const colorstone = globalColorstoneLabel
          ? d.colorstoneOptions.find((v) => v.label === globalColorstoneLabel)
          : null;
        next[d.id] = {
          metal: metal?.id ?? prev[d.id]?.metal ?? null,
          diamond: diamond?.id ?? prev[d.id]?.diamond ?? null,
          colorstone: colorstone?.id ?? prev[d.id]?.colorstone ?? null,
        };
      }
      return next;
    });
    setShowPricing(true);
  }

  function handleSelect(designId: string) {
    if (selectedDesignIds.has(designId)) {
      toast("Item already in bag");
      return;
    }
    const selection = variantSelections[designId];
    startTransition(async () => {
      const result = await addDesignToSelection(designId, {
        metalVariantId: selection?.metal,
        diamondVariantId: selection?.diamond,
        colorstoneVariantId: selection?.colorstone,
      });
      if (result.alreadyExists) {
        toast("Item already in bag");
        return;
      }
      setSelectedDesignIds((prev) => new Set(prev).add(designId));
      setSelectionCount((c) => c + 1);
      toast.success("Added to your selection bucket");
    });
  }

  const allMetalLabels = useMemo(
    () => Array.from(new Set(designs.flatMap((d) => d.metalOptions.map((v) => v.label)))),
    [designs]
  );
  const allDiamondLabels = useMemo(
    () => Array.from(new Set(designs.flatMap((d) => d.diamondOptions.map((v) => v.label)))),
    [designs]
  );
  const allColorstoneLabels = useMemo(
    () => Array.from(new Set(designs.flatMap((d) => d.colorstoneOptions.map((v) => v.label)))),
    [designs]
  );

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as "estrella" | "exclusive")}>
          <TabsList>
            <TabsTrigger value="estrella">Estrella Designs</TabsTrigger>
            <TabsTrigger value="exclusive">Exclusive Designs</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button variant="outline" size="sm" onClick={() => setFiltersOpen(true)}>
          <SlidersHorizontal className="size-4" /> Filters options
        </Button>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Select value={globalMetalLabel ?? undefined} onValueChange={setGlobalMetalLabel}>
            <SelectTrigger size="sm" className="w-36">
              <SelectValue placeholder="Metal (KT)" />
            </SelectTrigger>
            <SelectContent>
              {allMetalLabels.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={globalDiamondLabel ?? undefined} onValueChange={setGlobalDiamondLabel}>
            <SelectTrigger size="sm" className="w-40">
              <SelectValue placeholder="Diamond Quality" />
            </SelectTrigger>
            <SelectContent>
              {allDiamondLabels.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={globalColorstoneLabel ?? undefined}
            onValueChange={setGlobalColorstoneLabel}
          >
            <SelectTrigger size="sm" className="w-36">
              <SelectValue placeholder="Color Stone" />
            </SelectTrigger>
            <SelectContent>
              {allColorstoneLabels.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" variant="accent" onClick={applyGlobalPricing}>
            Check Pricing
          </Button>
        </div>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-150",
              category === c.value
                ? "bg-sidebar-active border-transparent text-brand-brown shadow-sm"
                : "border-brand-brown/15 text-brand-brown/65 hover:bg-sidebar-active/50"
            )}
          >
            {c.label}
            <span className="text-brand-brown/45 ml-1.5">{counts[c.value] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* Attribute tags */}
      <div className="flex flex-wrap gap-2">
        {ATTRIBUTE_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={cn(
              "rounded-full border px-3.5 py-1 text-xs font-medium transition-colors duration-150",
              activeTags.includes(tag)
                ? "bg-brand-brown border-transparent text-brand-white"
                : "border-brand-brown/15 text-brand-brown/60 hover:bg-sidebar-active/50"
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredDesigns.length === 0 ? (
        <p className="text-brand-brown/55 py-16 text-center text-sm">
          No designs match these filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDesigns.map((design) => (
            <DesignCard
              key={design.id}
              design={design}
              metalId={variantSelections[design.id]?.metal ?? null}
              diamondId={variantSelections[design.id]?.diamond ?? null}
              colorstoneId={variantSelections[design.id]?.colorstone ?? null}
              onVariantChange={(kind, id) => handleVariantChange(design.id, kind, id)}
              isSelected={selectedDesignIds.has(design.id)}
              onSelect={() => handleSelect(design.id)}
              showPricing={showPricing}
            />
          ))}
        </div>
      )}

      <FiltersSheet
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filters={filters}
        onApply={setFilters}
      />

      {selectionCount > 0 && (
        <button
          onClick={() => router.push("/business/selection-bucket")}
          disabled={isPending}
          className="hover-lift bg-brand-brown text-brand-white fixed right-8 bottom-8 z-40 flex items-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold shadow-xl"
        >
          <ShoppingBag className="size-4.5" />
          View Selected Items ({selectionCount})
        </button>
      )}
    </div>
  );
}
