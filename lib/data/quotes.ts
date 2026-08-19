"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/current-user";
import type { Tables } from "@/lib/types/database.types";

export type Quote = Tables<"quotes">;
export type QuoteWithCount = Quote & { itemCount: number };

export async function requestQuoteFromSelection(itemIds: string[], notes: string) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: items, error: itemsError } = await supabase
    .from("selection_items")
    .select("*")
    .in("id", itemIds);
  if (itemsError) throw itemsError;
  if (!items?.length) throw new Error("No items selected");

  const { data: quote, error: quoteError } = await supabase
    .from("quotes")
    .insert({
      requested_by: profile.id,
      account_id: profile.account_id,
      notes,
    })
    .select()
    .single();
  if (quoteError) throw quoteError;

  const { error: quoteItemsError } = await supabase.from("quote_items").insert(
    items.map((item) => ({
      quote_id: quote.id,
      design_id: item.design_id,
      metal_variant_id: item.metal_variant_id,
      diamond_variant_id: item.diamond_variant_id,
      colorstone_variant_id: item.colorstone_variant_id,
      quantity: item.quantity,
      remark: item.remark,
      price: item.price,
    }))
  );
  if (quoteItemsError) throw quoteItemsError;

  revalidatePath("/business/reports/quotes");
  return quote;
}

export async function getQuotes(): Promise<QuoteWithCount[]> {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quotes")
    .select("*, quote_items(count)")
    .eq("requested_by", profile.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => {
    const { quote_items, ...rest } = row as Quote & { quote_items: { count: number }[] };
    return { ...rest, itemCount: quote_items?.[0]?.count ?? 0 };
  });
}
