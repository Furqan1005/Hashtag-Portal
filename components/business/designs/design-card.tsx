"use client";

import { Check } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhotoPlaceholder } from "@/components/brand/photo-placeholder";
import { formatWeight, formatPrice } from "@/lib/weight-format";
import type { DesignWithVariants } from "@/lib/data/designs";
import type { Tables } from "@/lib/types/database.types";

type Variant = Tables<"design_variants">;

export function DesignCard({
  design,
  metalId,
  diamondId,
  colorstoneId,
  onVariantChange,
  isSelected,
  onSelect,
  showPricing,
}: {
  design: DesignWithVariants;
  metalId: string | null;
  diamondId: string | null;
  colorstoneId: string | null;
  onVariantChange: (kind: "metal" | "diamond" | "colorstone", variantId: string) => void;
  isSelected: boolean;
  onSelect: () => void;
  showPricing: boolean;
}) {
  const metal = design.metalOptions.find((v) => v.id === metalId) ?? design.metalOptions[0];
  const diamond = design.diamondOptions.find((v) => v.id === diamondId) ?? design.diamondOptions[0];
  const colorstone =
    design.colorstoneOptions.find((v) => v.id === colorstoneId) ?? design.colorstoneOptions[0];

  const price =
    design.base_price +
    (metal?.price_modifier ?? 0) +
    (diamond?.price_modifier ?? 0) +
    (colorstone?.price_modifier ?? 0);

  return (
    <Card className="hover-lift overflow-hidden py-0 gap-0">
      <div className="relative aspect-square w-full">
        <PhotoPlaceholder variant="cream" />
        {design.is_new_arrival && (
          <Badge className="absolute top-3 left-3 z-10" variant="gold">
            New
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-3.5 p-4">
        <div>
          <p className="text-brand-brown text-sm font-semibold">{design.sku}</p>
          <p className="text-brand-brown/55 text-xs capitalize">{design.category}</p>
        </div>

        <VariantRow
          label="Metal (KT)"
          options={design.metalOptions}
          value={metal}
          onChange={(id) => onVariantChange("metal", id)}
        />
        <VariantRow
          label="Diamond Quality"
          options={design.diamondOptions}
          value={diamond}
          onChange={(id) => onVariantChange("diamond", id)}
        />
        <VariantRow
          label="Colorstone"
          options={design.colorstoneOptions}
          value={colorstone}
          onChange={(id) => onVariantChange("colorstone", id)}
        />

        {showPricing && (
          <p className="font-heading text-lg font-semibold text-brand-brown">
            {formatPrice(price)}
          </p>
        )}

        <Button
          onClick={onSelect}
          variant={isSelected ? "subtle" : "default"}
          className={isSelected ? "bg-white text-success hover:bg-white" : ""}
        >
          {isSelected ? (
            <>
              <Check className="text-success size-4" /> Selected
            </>
          ) : (
            "Select"
          )}
        </Button>
      </div>
    </Card>
  );
}

function VariantRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Variant[];
  value: Variant | undefined;
  onChange: (id: string) => void;
}) {
  if (!options.length) return null;
  return (
    <div className="flex items-center justify-between gap-2">
      <Select value={value?.id} onValueChange={onChange}>
        <SelectTrigger size="sm" className="w-full">
          <SelectValue placeholder={label}>
            <span className="text-brand-brown/50 text-xs">{label}</span>
            <span className="truncate">{value?.label}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.id} value={opt.id}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value && (
        <span className="text-brand-brown/60 w-16 shrink-0 text-right text-xs">
          {formatWeight(value.weight, value.weight_unit as "gms" | "cts")}
        </span>
      )}
    </div>
  );
}
