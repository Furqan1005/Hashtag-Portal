import type { Tables } from "@/lib/types/database.types";

type Design = Tables<"designs">;
type DesignVariant = Tables<"design_variants">;

export function computeLinePrice(
  design: Pick<Design, "base_price">,
  variants: (DesignVariant | null | undefined)[],
  quantity: number = 1
): number {
  const modifierTotal = variants.reduce(
    (sum, v) => sum + (v?.price_modifier ?? 0),
    0
  );
  return (design.base_price + modifierTotal) * quantity;
}
