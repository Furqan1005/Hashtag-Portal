"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/current-user";
import { computeLinePrice } from "@/lib/data/pricing";
import type { Tables, Enums } from "@/lib/types/database.types";
import type { DesignWithVariants } from "@/lib/data/designs";

export type SelectionItem = Tables<"selection_items">;
export type SelectionItemWithDesign = SelectionItem & {
  design: DesignWithVariants;
  metalVariant: Tables<"design_variants"> | null;
  diamondVariant: Tables<"design_variants"> | null;
  colorstoneVariant: Tables<"design_variants"> | null;
};

export async function getSelectionItems(
  status: Enums<"selection_status">
): Promise<SelectionItemWithDesign[]> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("selection_items")
    .select(
      `*,
      design:designs(*, design_variants(*)),
      metalVariant:design_variants!selection_items_metal_variant_id_fkey(*),
      diamondVariant:design_variants!selection_items_diamond_variant_id_fkey(*),
      colorstoneVariant:design_variants!selection_items_colorstone_variant_id_fkey(*)`
    )
    .eq("user_id", profile.id)
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => {
    const { design_variants, ...design } = row.design as DesignWithVariants & {
      design_variants: Tables<"design_variants">[];
    };
    return {
      ...row,
      design: {
        ...design,
        metalOptions: design_variants.filter((v) => v.kind === "metal"),
        diamondOptions: design_variants.filter((v) => v.kind === "diamond_quality"),
        colorstoneOptions: design_variants.filter((v) => v.kind === "colorstone"),
      },
    } as SelectionItemWithDesign;
  });
}

export async function getSelectionCount(): Promise<number> {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("selection_items")
    .select("*", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .eq("status", "active");
  if (error) throw error;
  return count ?? 0;
}

export async function getActiveSelectionDesignIds(): Promise<string[]> {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("selection_items")
    .select("design_id")
    .eq("user_id", profile.id)
    .eq("status", "active");
  if (error) throw error;
  return (data ?? []).map((row) => row.design_id);
}

export async function addDesignToSelection(
  designId: string,
  chosenVariantIds?: {
    metalVariantId?: string | null;
    diamondVariantId?: string | null;
    colorstoneVariantId?: string | null;
  }
) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("selection_items")
    .select("id")
    .eq("user_id", profile.id)
    .eq("design_id", designId)
    .eq("status", "active")
    .maybeSingle();

  if (existing) {
    return { alreadyExists: true };
  }

  const { data: design, error: designError } = await supabase
    .from("designs")
    .select("*, design_variants(*)")
    .eq("id", designId)
    .single();
  if (designError) throw designError;

  const variants = design.design_variants as Tables<"design_variants">[];
  const pickOrDefault = (
    kind: Tables<"design_variants">["kind"],
    chosenId: string | null | undefined
  ) => {
    if (chosenId) {
      const chosen = variants.find((v) => v.id === chosenId && v.kind === kind);
      if (chosen) return chosen;
    }
    return (
      variants.find((v) => v.kind === kind && v.is_default) ??
      variants.find((v) => v.kind === kind)
    );
  };

  const metal = pickOrDefault("metal", chosenVariantIds?.metalVariantId);
  const diamond = pickOrDefault("diamond_quality", chosenVariantIds?.diamondVariantId);
  const colorstone = pickOrDefault("colorstone", chosenVariantIds?.colorstoneVariantId);

  const price = computeLinePrice(design, [metal, diamond, colorstone]);

  const { error } = await supabase.from("selection_items").insert({
    user_id: profile.id,
    design_id: designId,
    metal_variant_id: metal?.id ?? null,
    diamond_variant_id: diamond?.id ?? null,
    colorstone_variant_id: colorstone?.id ?? null,
    price,
    status: "active",
  });
  if (error) throw error;

  revalidatePath("/business/designs");
  revalidatePath("/business/selection-bucket");
  return { alreadyExists: false };
}

export async function updateSelectionVariant(
  itemId: string,
  kind: "metal" | "diamond" | "colorstone",
  variantId: string
) {
  await requireProfile();
  const supabase = await createClient();

  const column =
    kind === "metal"
      ? "metal_variant_id"
      : kind === "diamond"
      ? "diamond_variant_id"
      : "colorstone_variant_id";

  const { data: item, error: itemError } = await supabase
    .from("selection_items")
    .select("*, design:designs(base_price)")
    .eq("id", itemId)
    .single();
  if (itemError) throw itemError;

  const { data: variant, error: variantError } = await supabase
    .from("design_variants")
    .select("*")
    .eq("id", variantId)
    .single();
  if (variantError) throw variantError;

  const otherIds = [item.metal_variant_id, item.diamond_variant_id, item.colorstone_variant_id].filter(
    (id): id is string => Boolean(id) && id !== item[column as keyof typeof item]
  );
  const { data: others } = otherIds.length
    ? await supabase.from("design_variants").select("*").in("id", otherIds)
    : { data: [] };

  const variants = [variant, ...(others ?? [])].filter((v) => {
    if (kind === "metal") return v.id === variantId || v.kind !== "metal";
    if (kind === "diamond") return v.id === variantId || v.kind !== "diamond_quality";
    return v.id === variantId || v.kind !== "colorstone";
  });

  const price = computeLinePrice(
    { base_price: (item.design as { base_price: number }).base_price },
    variants,
    item.quantity
  );

  const patch: Partial<Tables<"selection_items">> = {
    price,
    updated_at: new Date().toISOString(),
  };
  patch[column] = variantId;

  const { error } = await supabase.from("selection_items").update(patch).eq("id", itemId);
  if (error) throw error;

  revalidatePath("/business/selection-bucket");
  revalidatePath("/business/selection-bucket/order");
  revalidatePath("/business/saved");
}

export async function updateSelectionRemark(itemId: string, remark: string) {
  await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase
    .from("selection_items")
    .update({ remark, updated_at: new Date().toISOString() })
    .eq("id", itemId);
  if (error) throw error;
  revalidatePath("/business/selection-bucket");
  revalidatePath("/business/selection-bucket/order");
}

export async function updateSelectionQuantity(itemId: string, quantity: number) {
  await requireProfile();
  const supabase = await createClient();

  const { data: item, error: itemError } = await supabase
    .from("selection_items")
    .select("*, design:designs(base_price)")
    .eq("id", itemId)
    .single();
  if (itemError) throw itemError;

  const ids = [item.metal_variant_id, item.diamond_variant_id, item.colorstone_variant_id].filter(
    (id): id is string => Boolean(id)
  );
  const { data: variants } = ids.length
    ? await supabase.from("design_variants").select("*").in("id", ids)
    : { data: [] };

  const price = computeLinePrice(
    { base_price: (item.design as { base_price: number }).base_price },
    variants ?? [],
    quantity
  );

  const { error } = await supabase
    .from("selection_items")
    .update({ quantity, price, updated_at: new Date().toISOString() })
    .eq("id", itemId);
  if (error) throw error;
  revalidatePath("/business/selection-bucket/order");
}

export async function moveSelectionItem(
  itemId: string,
  status: Enums<"selection_status">
) {
  await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase
    .from("selection_items")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", itemId);
  if (error) throw error;

  revalidatePath("/business/selection-bucket");
  revalidatePath("/business/saved");
}

export async function removeSelectionItem(itemId: string) {
  await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("selection_items").delete().eq("id", itemId);
  if (error) throw error;
  revalidatePath("/business/selection-bucket");
  revalidatePath("/business/saved");
}
