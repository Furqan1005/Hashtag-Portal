"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatWeight } from "@/lib/weight-format";
import type { Tables } from "@/lib/types/database.types";

export function VariantSelect({
  options,
  value,
  onChange,
  disabled,
}: {
  options: Tables<"design_variants">[];
  value: Tables<"design_variants"> | null;
  onChange: (variantId: string) => void;
  disabled?: boolean;
}) {
  if (!options.length) return <span className="text-brand-brown/40 text-sm">—</span>;

  return (
    <div className="flex flex-col gap-0.5">
      <Select value={value?.id} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger size="sm" className="w-40">
          <SelectValue placeholder="Select" />
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
        <span className="text-brand-brown/50 pl-1 text-xs">
          {formatWeight(value.weight, value.weight_unit as "gms" | "cts")}
        </span>
      )}
    </div>
  );
}
