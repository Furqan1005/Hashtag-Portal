"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { DesignCard } from "@/components/business/designs/design-card";
import { addDesignToSelection } from "@/lib/data/selections";
import type { DesignWithVariants } from "@/lib/data/designs";

type VariantSelection = { metal: string | null; diamond: string | null; colorstone: string | null };

export function NewArrivalsClient({
  designs,
  initialSelectedDesignIds,
  initialSelectionCount,
}: {
  designs: DesignWithVariants[];
  initialSelectedDesignIds: string[];
  initialSelectionCount: number;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

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

  if (designs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <Sparkles className="text-brand-brown/25 size-10" />
        <p className="text-brand-brown/60 text-sm">No new arrivals just yet — check back soon.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-24">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {designs.map((design) => (
          <DesignCard
            key={design.id}
            design={design}
            metalId={variantSelections[design.id]?.metal ?? null}
            diamondId={variantSelections[design.id]?.diamond ?? null}
            colorstoneId={variantSelections[design.id]?.colorstone ?? null}
            onVariantChange={(kind, id) =>
              setVariantSelections((prev) => ({
                ...prev,
                [design.id]: { ...prev[design.id], [kind]: id },
              }))
            }
            isSelected={selectedDesignIds.has(design.id)}
            onSelect={() => handleSelect(design.id)}
            showPricing={false}
          />
        ))}
      </div>

      {selectionCount > 0 && (
        <button
          onClick={() => router.push("/business/selection-bucket")}
          className="hover-lift bg-brand-brown text-brand-white fixed right-8 bottom-8 z-40 flex items-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold shadow-xl"
        >
          <ShoppingBag className="size-4.5" />
          View Selected Items ({selectionCount})
        </button>
      )}
    </div>
  );
}
