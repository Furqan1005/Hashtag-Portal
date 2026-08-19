"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/current-user";
import type { Tables } from "@/lib/types/database.types";

export type Order = Tables<"orders">;
export type OrderItem = Tables<"order_items">;
export type OrderWithItems = Order & { order_items: OrderItem[] };

function generatePoNo() {
  const now = new Date();
  const stamp = now.toISOString().slice(2, 10).replace(/-/g, "");
  const rand = Math.floor(Math.random() * 900 + 100);
  return `PO-${stamp}-${rand}`;
}

export async function placeFinalOrder(itemIds: string[], remark?: string) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: items, error: itemsError } = await supabase
    .from("selection_items")
    .select(
      "*, design:designs(*), metalVariant:design_variants!selection_items_metal_variant_id_fkey(*)"
    )
    .in("id", itemIds);
  if (itemsError) throw itemsError;
  if (!items?.length) throw new Error("No items selected");

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      placed_by: profile.id,
      account_id: profile.account_id,
      po_no: generatePoNo(),
      status: "pending",
      total_amount: total,
      balance_amount: total,
      exp_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString().slice(0, 10),
    })
    .select()
    .single();
  if (orderError) throw orderError;

  const { error: orderItemsError } = await supabase.from("order_items").insert(
    items.map((item) => {
      const design = item.design as Tables<"designs">;
      const metal = item.metalVariant as Tables<"design_variants"> | null;
      return {
        order_id: order.id,
        design_id: item.design_id,
        design_no: design.sku,
        kt_col_label: metal?.label ?? null,
        size: "—",
        metal_variant_id: item.metal_variant_id,
        diamond_variant_id: item.diamond_variant_id,
        colorstone_variant_id: item.colorstone_variant_id,
        quantity: item.quantity,
        ordered_qty: item.quantity,
        finished_qty: 0,
        exported_qty: 0,
        balance_qty: item.quantity,
        delay_info: null,
        remark: remark ?? item.remark,
        price: item.price,
      };
    })
  );
  if (orderItemsError) throw orderItemsError;

  const { error: deleteError } = await supabase
    .from("selection_items")
    .delete()
    .in("id", itemIds);
  if (deleteError) throw deleteError;

  revalidatePath("/business/selection-bucket");
  revalidatePath("/business/selection-bucket/order");
  revalidatePath("/business/reports/order-history");
  return order;
}

export async function getOrderHistory(): Promise<OrderWithItems[]> {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .or(`placed_by.eq.${profile.id}${profile.account_id ? `,account_id.eq.${profile.account_id}` : ""}`)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as OrderWithItems[];
}
