"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { DesignCard } from "@/components/business/designs/design-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/weight-format";
import type { DesignWithVariants } from "@/lib/data/designs";

type VariantSelection = { metal: string | null; diamond: string | null; colorstone: string | null };
type CartLine = VariantSelection & { designId: string; quantity: number };

export function ShowroomDesignsClient({
  designs,
  staffName,
  initialCustomerName,
}: {
  designs: DesignWithVariants[];
  staffName: string;
  initialCustomerName: string;
}) {
  const router = useRouter();

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

  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState(initialCustomerName);
  const [submitting, setSubmitting] = useState(false);

  const designById = useMemo(() => new Map(designs.map((d) => [d.id, d])), [designs]);

  function lineTotal(line: CartLine) {
    const design = designById.get(line.designId);
    if (!design) return 0;
    const metal = design.metalOptions.find((v) => v.id === line.metal);
    const diamond = design.diamondOptions.find((v) => v.id === line.diamond);
    const colorstone = design.colorstoneOptions.find((v) => v.id === line.colorstone);
    return (
      (design.base_price +
        (metal?.price_modifier ?? 0) +
        (diamond?.price_modifier ?? 0) +
        (colorstone?.price_modifier ?? 0)) *
      line.quantity
    );
  }

  const cartTotal = cart.reduce((sum, line) => sum + lineTotal(line), 0);

  function handleSelect(designId: string) {
    if (cart.some((l) => l.designId === designId)) {
      toast("Item already in bag");
      return;
    }
    const selection = variantSelections[designId];
    setCart((prev) => [...prev, { designId, ...selection, quantity: 1 }]);
    toast.success("Added to customer's selection");
  }

  function removeLine(designId: string) {
    setCart((prev) => prev.filter((l) => l.designId !== designId));
  }

  async function handlePlaceOrder() {
    if (!customerName.trim()) {
      toast.error("Enter the customer's name first");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/showroom/place-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName,
        lines: cart.map((l) => ({
          designId: l.designId,
          metalVariantId: l.metal,
          diamondVariantId: l.diamond,
          colorstoneVariantId: l.colorstone,
          quantity: l.quantity,
        })),
      }),
    });
    setSubmitting(false);

    if (!res.ok) {
      toast.error("Couldn't place this order");
      return;
    }
    const data = await res.json();
    toast.success(`Order ${data.poNo} placed for ${customerName}`);
    setCart([]);
    setCartOpen(false);
    router.push("/showroom/floor");
  }

  return (
    <>
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
            isSelected={cart.some((l) => l.designId === design.id)}
            onSelect={() => handleSelect(design.id)}
            showPricing={false}
          />
        ))}
      </div>

      {cart.length > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="hover-lift bg-brand-brown text-brand-white fixed right-8 bottom-8 z-40 flex items-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold shadow-xl"
        >
          <ShoppingBag className="size-4.5" />
          View Selected Items ({cart.length})
        </button>
      )}

      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Customer&apos;s Selection</DialogTitle>
            <DialogDescription>
              Place this order on the customer&apos;s behalf. Staff: {staffName}.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="customer-name">Customer name</Label>
            <Input
              id="customer-name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Jane Doe"
            />
          </div>

          <div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
            {cart.map((line) => {
              const design = designById.get(line.designId);
              if (!design) return null;
              return (
                <div
                  key={line.designId}
                  className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2"
                >
                  <div>
                    <p className="text-brand-brown text-sm font-medium">{design.sku}</p>
                    <p className="text-brand-brown/55 text-xs capitalize">{design.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-brand-brown text-sm font-medium">
                      {formatPrice(lineTotal(line))}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => removeLine(line.designId)}>
                      <Trash2 className="text-destructive size-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-border/60 flex items-center justify-between border-t pt-3">
            <span className="text-brand-brown text-sm font-medium">Total</span>
            <span className="font-heading text-lg font-semibold text-brand-brown">
              {formatPrice(cartTotal)}
            </span>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCartOpen(false)}>
              Continue Browsing
            </Button>
            <Button onClick={handlePlaceOrder} disabled={submitting || cart.length === 0}>
              Place Order for Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
