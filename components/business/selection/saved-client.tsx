"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Undo2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PhotoPlaceholder } from "@/components/brand/photo-placeholder";
import { VariantSelect } from "@/components/business/selection/variant-select";
import { formatPrice, formatWeight } from "@/lib/weight-format";
import {
  moveSelectionItem,
  updateSelectionVariant,
  type SelectionItemWithDesign,
} from "@/lib/data/selections";

export function SavedClient({ items }: { items: SelectionItemWithDesign[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleVariantChange(itemId: string, kind: "metal" | "diamond" | "colorstone", variantId: string) {
    startTransition(async () => {
      await updateSelectionVariant(itemId, kind, variantId);
      router.refresh();
    });
  }

  function handleMoveBack(itemId: string) {
    startTransition(async () => {
      await moveSelectionItem(itemId, "active");
      toast.success("Moved back to your selection bucket");
      router.refresh();
    });
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <Bookmark className="text-brand-brown/25 size-10" />
        <p className="text-brand-brown/60 text-sm">Nothing saved for later yet.</p>
      </div>
    );
  }

  return (
    <div className="card-surface overflow-hidden rounded-xl border border-border/60">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Details</TableHead>
            <TableHead>Metal KT</TableHead>
            <TableHead>Diamond Quality</TableHead>
            <TableHead>Color Stone</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const metal =
              item.design.metalOptions.find((v) => v.id === item.metal_variant_id) ?? null;
            const diamond =
              item.design.diamondOptions.find((v) => v.id === item.diamond_variant_id) ?? null;
            const colorstone =
              item.design.colorstoneOptions.find((v) => v.id === item.colorstone_variant_id) ??
              null;

            return (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-lg">
                      <PhotoPlaceholder variant="cream" />
                    </div>
                    <div>
                      <p className="text-brand-brown text-sm font-semibold">{item.design.sku}</p>
                      <p className="text-brand-brown/55 text-xs capitalize">
                        {item.design.category}
                      </p>
                      {metal && (
                        <p className="text-brand-brown/45 text-xs">
                          {formatWeight(metal.weight, "gms")}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <VariantSelect
                    options={item.design.metalOptions}
                    value={metal}
                    onChange={(id) => handleVariantChange(item.id, "metal", id)}
                  />
                </TableCell>
                <TableCell>
                  <VariantSelect
                    options={item.design.diamondOptions}
                    value={diamond}
                    onChange={(id) => handleVariantChange(item.id, "diamond", id)}
                  />
                </TableCell>
                <TableCell>
                  <VariantSelect
                    options={item.design.colorstoneOptions}
                    value={colorstone}
                    onChange={(id) => handleVariantChange(item.id, "colorstone", id)}
                  />
                </TableCell>
                <TableCell className="text-right font-medium">{formatPrice(item.price)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMoveBack(item.id)}
                    disabled={isPending}
                  >
                    <Undo2 className="size-4" /> Move to Selection
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
