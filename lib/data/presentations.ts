"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/current-user";
import type { Tables } from "@/lib/types/database.types";

export type Presentation = Tables<"presentations">;
export type PresentationWithCount = Presentation & { itemCount: number };

export async function createPresentationFromSelection(itemIds: string[], name?: string) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: items, error: itemsError } = await supabase
    .from("selection_items")
    .select("*")
    .in("id", itemIds);
  if (itemsError) throw itemsError;
  if (!items?.length) throw new Error("No items selected");

  const { data: presentation, error: presentationError } = await supabase
    .from("presentations")
    .insert({
      created_by: profile.id,
      account_id: profile.account_id,
      name: name?.trim() || `Presentation ${new Date().toLocaleDateString()}`,
    })
    .select()
    .single();
  if (presentationError) throw presentationError;

  const { error: itemsInsertError } = await supabase.from("presentation_items").insert(
    items.map((item) => ({
      presentation_id: presentation.id,
      design_id: item.design_id,
      metal_variant_id: item.metal_variant_id,
      diamond_variant_id: item.diamond_variant_id,
      colorstone_variant_id: item.colorstone_variant_id,
      remark: item.remark,
    }))
  );
  if (itemsInsertError) throw itemsInsertError;

  revalidatePath("/business/reports/presentations");
  return presentation;
}

export async function getPresentations(): Promise<PresentationWithCount[]> {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("presentations")
    .select("*, presentation_items(count)")
    .eq("created_by", profile.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => {
    const { presentation_items, ...rest } = row as Presentation & {
      presentation_items: { count: number }[];
    };
    return { ...rest, itemCount: presentation_items?.[0]?.count ?? 0 };
  });
}
