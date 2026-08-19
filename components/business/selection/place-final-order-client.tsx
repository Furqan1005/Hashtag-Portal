"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, RefreshCw, Wand2, Bookmark } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { PlaceOrderDialog } from "@/components/business/selection/place-order-dialog";
import { formatPrice, formatWeight } from "@/lib/weight-format";
import {
  moveSelectionItem,
  updateSelectionQuantity,
  updateSelectionVariant,
  type SelectionItemWithDesign,
} from "@/lib/data/selections";

function metalColorFromLabel(label: string | undefined) {
  if (!label) return "—";
  const parts = label.split(" ");
  return parts[parts.length - 1];
}

export function PlaceFinalOrderClient({ items }: { items: SelectionItemWithDesign[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [localItems, setLocalItems] = useState(items);

  const totalItems = localItems.length;
  const totalQuantity = useMemo(
    () => localItems.reduce((sum, i) => sum + i.quantity, 0),
    [localItems]
  );
  const total = useMemo(() => localItems.reduce((sum, i) => sum + i.price, 0), [localItems]);

  function handleVariantChange(itemId: string, kind: "metal" | "diamond" | "colorstone", variantId: string) {
    startTransition(async () => {
      await updateSelectionVariant(itemId, kind, variantId);
      router.refresh();
    });
  }

  function handleQuantityChange(itemId: string, quantity: number) {
    setLocalItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity } : i)));
    startTransition(async () => {
      await updateSelectionQuantity(itemId, quantity);
      router.refresh();
    });
  }

  function handleSaveForLater(itemId: string) {
    startTransition(async () => {
      await moveSelectionItem(itemId, "saved");
      toast.success("Saved for later");
      setLocalItems((prev) => prev.filter((i) => i.id !== itemId));
      router.refresh();
    });
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-brand-brown/60 text-sm">No items were selected for this order.</p>
        <Button asChild variant="outline">
          <Link href="/business/selection-bucket">← Back to selection bucket</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-8">
      <Link
        href="/business/selection-bucket"
        className="text-brand-brown/60 hover:text-brand-brown -mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-medium"
      >
        <ArrowLeft className="size-4" /> Back to selection bucket
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <p className="text-brand-brown text-sm font-medium">
            {totalItems} Items selected ({formatPrice(total)})
          </p>
          <p className="text-brand-brown/60 text-sm">Total Quantity {totalQuantity}</p>
          <p className="text-brand-brown/60 text-sm">Current Gold base $68.20/g</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              router.refresh();
              toast.success("Prices recalculated");
            }}
          >
            <RefreshCw className="size-4" /> Recalculating Price
          </Button>
          <Button variant="outline" size="sm">
            <Wand2 className="size-4" /> Bulk quality update
          </Button>
        </div>
      </div>

      <div className="card-surface overflow-hidden rounded-xl border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Details</TableHead>
              <TableHead>Metal KT</TableHead>
              <TableHead>Metal Color</TableHead>
              <TableHead>Diamond Quality</TableHead>
              <TableHead>Color Stone</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Remark</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {localItems.map((item) => {
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
                  <TableCell>{metalColorFromLabel(metal?.label)}</TableCell>
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
                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      className="w-16"
                      onChange={(e) =>
                        handleQuantityChange(item.id, Math.max(1, Number(e.target.value) || 1))
                      }
                    />
                  </TableCell>
                  <TableCell className="text-brand-brown/60 max-w-[140px] truncate text-sm">
                    {item.remark || "—"}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(item.price)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSaveForLater(item.id)}
                      disabled={isPending}
                    >
                      <Bookmark className="size-4" /> Save For Later
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button size="lg" onClick={() => setOrderDialogOpen(true)} disabled={localItems.length === 0}>
          Place Your order <ArrowRight className="size-4" />
        </Button>
      </div>

      <PlaceOrderDialog
        open={orderDialogOpen}
        onOpenChange={setOrderDialogOpen}
        itemIds={localItems.map((i) => i.id)}
      />
    </div>
  );
}
