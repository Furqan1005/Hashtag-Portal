import { createClient } from "@/lib/supabase/server";
import type { Tables, Enums, Database } from "@/lib/types/database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

export type Design = Tables<"designs">;
export type DesignVariant = Tables<"design_variants">;

export type DesignWithVariants = Design & {
  metalOptions: DesignVariant[];
  diamondOptions: DesignVariant[];
  colorstoneOptions: DesignVariant[];
};

type Client = SupabaseClient<Database>;

function groupVariants(design: Design & { design_variants: DesignVariant[] }): DesignWithVariants {
  const { design_variants, ...rest } = design;
  return {
    ...rest,
    metalOptions: design_variants
      .filter((v) => v.kind === "metal")
      .sort((a, b) => a.sort_order - b.sort_order),
    diamondOptions: design_variants
      .filter((v) => v.kind === "diamond_quality")
      .sort((a, b) => a.sort_order - b.sort_order),
    colorstoneOptions: design_variants
      .filter((v) => v.kind === "colorstone")
      .sort((a, b) => a.sort_order - b.sort_order),
  };
}

export async function getDesigns(
  filters?: {
    designType?: Enums<"design_type">;
    category?: Enums<"design_category">;
    isNewArrival?: boolean;
  },
  client?: Client
): Promise<DesignWithVariants[]> {
  const supabase = client ?? (await createClient());
  let query = supabase
    .from("designs")
    .select("*, design_variants(*)")
    .order("created_at", { ascending: false });

  if (filters?.designType) query = query.eq("design_type", filters.designType);
  if (filters?.category) query = query.eq("category", filters.category);
  if (filters?.isNewArrival) query = query.eq("is_new_arrival", true);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(groupVariants);
}

export async function getDesignCounts(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("designs").select("category");
  if (error) throw error;
  const counts: Record<string, number> = { all: data?.length ?? 0 };
  for (const row of data ?? []) {
    counts[row.category] = (counts[row.category] ?? 0) + 1;
  }
  return counts;
}

export async function getDesignById(id: string): Promise<DesignWithVariants | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("designs")
    .select("*, design_variants(*)")
    .eq("id", id)
    .single();
  if (error) return null;
  return groupVariants(data);
}
