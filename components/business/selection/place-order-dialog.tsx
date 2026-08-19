"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { placeFinalOrder } from "@/lib/data/orders";

const MAX_LENGTH = 500;

export function PlaceOrderDialog({
  open,
  onOpenChange,
  itemIds,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemIds: string[];
}) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await placeFinalOrder(itemIds, notes);
      toast.success("Order placed — our team will confirm shortly");
      onOpenChange(false);
      router.push("/business/reports/order-history");
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Place your Order</DialogTitle>
          <DialogDescription>
            This will submit your selected items to our production team for confirmation. You&apos;ll
            be notified once the order is accepted.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="order-notes">Additional Notes / Remark (Optional)</Label>
          <Textarea
            id="order-notes"
            value={notes}
            maxLength={MAX_LENGTH}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Delivery instructions, packaging preferences, etc."
          />
          <p className="text-brand-brown/45 self-end text-xs">
            {notes.length}/{MAX_LENGTH}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isPending || itemIds.length === 0}>
            Confirm Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
