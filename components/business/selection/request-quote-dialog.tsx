"use client";

import { useState, useTransition } from "react";
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
import { requestQuoteFromSelection } from "@/lib/data/quotes";

const MAX_LENGTH = 500;

export function RequestQuoteDialog({
  open,
  onOpenChange,
  itemIds,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemIds: string[];
  onSuccess: () => void;
}) {
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSend() {
    startTransition(async () => {
      await requestQuoteFromSelection(itemIds, notes);
      toast.success("Quote request sent to our team");
      setNotes("");
      onOpenChange(false);
      onSuccess();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Quote</DialogTitle>
          <DialogDescription>
            Send your selected items to our team and we will get back to you with a quote.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="quote-notes">Additional Notes / Remark (Optional)</Label>
          <Textarea
            id="quote-notes"
            value={notes}
            maxLength={MAX_LENGTH}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Anything our team should know about this request…"
          />
          <p className="text-brand-brown/45 self-end text-xs">
            {notes.length}/{MAX_LENGTH}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isPending || itemIds.length === 0}>
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
