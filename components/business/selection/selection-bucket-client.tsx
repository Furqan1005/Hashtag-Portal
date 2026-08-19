"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Share2,
  Trash2,
  Heart,
  RefreshCw,
  Wand2,
  ShoppingBag,
  FileText,
  Presentation,
  Bookmark,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhotoPlaceholder } from "@/components/brand/photo-placeholder";
import { VariantSelect } from "@/components/business/selection/variant-select";
import { RequestQuoteDialog } from "@/components/business/selection/request-quote-dialog";
import { formatPrice, formatWeight } from "@/lib/weight-format";
import {
  moveSelectionItem,
  removeSelectionItem,
  updateSelectionRemark,
  updateSelectionVariant,
  type SelectionItemWithDesign,
} from "@/lib/data/selections";
import { createPresentationFromSelection } from "@/lib/data/presentations";

export function SelectionBucketClient({ items }: { items: SelectionItemWithDesign[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [remarkDrafts, setRemarkDrafts] = useState<Record<string, string>>({});
  const [quoteOpen, setQuoteOpen] = useState(false);

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price, 0), [items]);
  const checkedIds = Array.from(checked);
  const hasChecked = checkedIds.length > 0;

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setChecked((prev) => (prev.size === items.length ? new Set() : new Set(items.map((i) => i.id))));
  }

  function handleVariantChange(itemId: string, kind: "metal" | "diamond" | "colorstone", variantId: string) {
    startTransition(async () => {
      await updateSelectionVariant(itemId, kind, variantId);
      router.refresh();
    });
  }

  function handleRemarkBlur(itemId: string) {
    const value = remarkDrafts[itemId];
    if (value === undefined) return;
    startTransition(async () => {
      await updateSelectionRemark(itemId, value);
    });
  }

  function handleSaveForLater(itemId: string) {
    startTransition(async () => {
      await moveSelectionItem(itemId, "saved");
      toast.success("Saved for later");
      router.refresh();
    });
  }

  function handleBulkSaveForLater() {
    startTransition(async () => {
      await Promise.all(checkedIds.map((id) => moveSelectionItem(id, "saved")));
      toast.success(`Saved ${checkedIds.length} item(s) for later`);
      setChecked(new Set());
      router.refresh();
    });
  }

  function handleBulkDelete() {
    startTransition(async () => {
      await Promise.all(checkedIds.map((id) => removeSelectionItem(id)));
      toast.success(`Removed ${checkedIds.length} item(s)`);
      setChecked(new Set());
      router.refresh();
    });
  }

  function handleShare() {
    const summary = items
      .filter((i) => checked.size === 0 || checked.has(i.id))
      .map((i) => `${i.design.sku} — ${formatPrice(i.price)}`)
      .join("\n");
    navigator.clipboard?.writeText(summary);
    toast.success("Selection summary copied");
  }

  function handleRecalculate() {
    startTransition(() => {
      router.refresh();
      toast.success("Prices recalculated");
    });
  }

  function handlePlaceFinalOrder() {
    if (!hasChecked) {
      toast("Select at least one item first");
      return;
    }
    router.push(`/business/selection-bucket/order?items=${checkedIds.join(",")}`);
  }

  function handleCreatePresentation() {
    if (!hasChecked) {
      toast("Select at least one item first");
      return;
    }
    startTransition(async () => {
      await createPresentationFromSelection(checkedIds);
      toast.success("Presentation created");
      setChecked(new Set());
    });
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <ShoppingBag className="text-brand-brown/25 size-10" />
        <p className="text-brand-brown/60 text-sm">Your selection bucket is empty.</p>
        <Button asChild variant="outline">
          <a href="/business/designs">Browse Designs</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-28">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-brand-brown text-sm font-medium">
          {items.length} Items selected ({formatPrice(total)} total)
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <BulkQualityPopover items={items} checkedIds={checkedIds} onApplied={() => router.refresh()} />
          <Button variant="outline" size="sm" onClick={handleRecalculate}>
            <RefreshCw className="size-4" /> Recalculating Price
          </Button>
          <IconButton icon={Share2} label="Share selection" onClick={handleShare} />
          <IconButton icon={Heart} label="Save selected for later" onClick={handleBulkSaveForLater} disabled={!hasChecked} />
          <IconButton icon={Trash2} label="Remove selected" onClick={handleBulkDelete} disabled={!hasChecked} />
        </div>
      </div>

      <div className="card-surface overflow-hidden rounded-xl border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={checked.size === items.length}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>Item Details</TableHead>
              <TableHead>Metal KT</TableHead>
              <TableHead>Diamond Quality</TableHead>
              <TableHead>Color Stone</TableHead>
              <TableHead>Remark</TableHead>
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
                    <Checkbox checked={checked.has(item.id)} onCheckedChange={() => toggle(item.id)} />
                  </TableCell>
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
                  <TableCell>
                    <Input
                      defaultValue={item.remark}
                      placeholder="Write Remark"
                      className="w-40"
                      onChange={(e) =>
                        setRemarkDrafts((prev) => ({ ...prev, [item.id]: e.target.value }))
                      }
                      onBlur={() => handleRemarkBlur(item.id)}
                    />
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

      <RequestQuoteDialog
        open={quoteOpen}
        onOpenChange={setQuoteOpen}
        itemIds={checkedIds}
        onSuccess={() => setChecked(new Set())}
      />

      <div className="card-surface fixed inset-x-0 bottom-0 z-30 border-t border-border/60 px-8 py-4 shadow-[0_-8px_24px_rgba(84,50,20,0.08)] sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3">
          <ActionButton
            icon={ShoppingBag}
            label="Place Final Order"
            description="Send checked items to production"
            onClick={handlePlaceFinalOrder}
          />
          <ActionButton
            icon={FileText}
            label="Request Quote"
            description="Get pricing from our team"
            onClick={() => {
              if (!hasChecked) {
                toast("Select at least one item first");
                return;
              }
              setQuoteOpen(true);
            }}
          />
          <ActionButton
            icon={Presentation}
            label="Create Presentation"
            description="Build a client-ready deck"
            onClick={handleCreatePresentation}
          />
          <ActionButton
            icon={Bookmark}
            label="Save for Later"
            description="Move checked items to Saved"
            onClick={() => {
              if (!hasChecked) {
                toast("Select at least one item first");
                return;
              }
              handleBulkSaveForLater();
            }}
          />
        </div>
      </div>
    </div>
  );
}

function IconButton({
  icon: Icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button variant="outline" size="icon" onClick={onClick} disabled={disabled} title={label}>
      <Icon className="size-4" />
      <span className="sr-only">{label}</span>
    </Button>
  );
}

function ActionButton({
  icon: Icon,
  label,
  description,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="hover-lift flex min-w-[190px] flex-1 items-center gap-3 rounded-xl border border-border/60 bg-white/50 px-4 py-2.5 text-left transition-colors hover:bg-sidebar-active/50"
    >
      <div className="bg-sidebar-active flex size-9 shrink-0 items-center justify-center rounded-full">
        <Icon className="text-brand-brown size-4.5" />
      </div>
      <div>
        <p className="text-brand-brown text-sm font-semibold">{label}</p>
        <p className="text-brand-brown/55 text-xs">{description}</p>
      </div>
    </button>
  );
}

function BulkQualityPopover({
  items,
  checkedIds,
  onApplied,
}: {
  items: SelectionItemWithDesign[];
  checkedIds: string[];
  onApplied: () => void;
}) {
  const [metalLabel, setMetalLabel] = useState<string | undefined>();
  const [diamondLabel, setDiamondLabel] = useState<string | undefined>();
  const [colorstoneLabel, setColorstoneLabel] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const metalLabels = Array.from(
    new Set(items.flatMap((i) => i.design.metalOptions.map((v) => v.label)))
  );
  const diamondLabels = Array.from(
    new Set(items.flatMap((i) => i.design.diamondOptions.map((v) => v.label)))
  );
  const colorstoneLabels = Array.from(
    new Set(items.flatMap((i) => i.design.colorstoneOptions.map((v) => v.label)))
  );

  function apply() {
    const targets = checkedIds.length ? checkedIds : items.map((i) => i.id);
    startTransition(async () => {
      await Promise.all(
        targets.map(async (id) => {
          const item = items.find((i) => i.id === id);
          if (!item) return;
          if (metalLabel) {
            const v = item.design.metalOptions.find((o) => o.label === metalLabel);
            if (v) await updateSelectionVariant(id, "metal", v.id);
          }
          if (diamondLabel) {
            const v = item.design.diamondOptions.find((o) => o.label === diamondLabel);
            if (v) await updateSelectionVariant(id, "diamond", v.id);
          }
          if (colorstoneLabel) {
            const v = item.design.colorstoneOptions.find((o) => o.label === colorstoneLabel);
            if (v) await updateSelectionVariant(id, "colorstone", v.id);
          }
        })
      );
      toast.success(`Updated ${targets.length} item(s)`);
      onApplied();
    });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Wand2 className="size-4" /> Bulk quality update
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <p className="text-brand-brown mb-3 text-sm font-medium">
          Apply to {checkedIds.length || items.length} item(s)
        </p>
        <div className="flex flex-col gap-2.5">
          <Select value={metalLabel} onValueChange={setMetalLabel}>
            <SelectTrigger size="sm" className="w-full">
              <SelectValue placeholder="Metal (KT)" />
            </SelectTrigger>
            <SelectContent>
              {metalLabels.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={diamondLabel} onValueChange={setDiamondLabel}>
            <SelectTrigger size="sm" className="w-full">
              <SelectValue placeholder="Diamond Quality" />
            </SelectTrigger>
            <SelectContent>
              {diamondLabels.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={colorstoneLabel} onValueChange={setColorstoneLabel}>
            <SelectTrigger size="sm" className="w-full">
              <SelectValue placeholder="Color Stone" />
            </SelectTrigger>
            <SelectContent>
              {colorstoneLabels.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={apply} disabled={isPending} className="mt-1">
            Apply Update
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
