import { createServiceRoleClient } from "@/lib/supabase/server";
import { getDesigns, type DesignWithVariants } from "@/lib/data/designs";
import type { Tables } from "@/lib/types/database.types";

export type ShowroomStaff = Pick<Tables<"showroom_staff">, "id" | "full_name" | "avatar_url">;

/**
 * Showroom pages are gated by the signed cookie in proxy.ts, not Supabase
 * Auth — so they read through the service-role client server-side rather
 * than relying on a browser session and RLS.
 */
export async function getShowroomStaffRoster(): Promise<ShowroomStaff[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("showroom_staff")
    .select("id, full_name, avatar_url")
    .eq("active", true)
    .order("full_name");
  if (error) throw error;
  return data ?? [];
}

export async function getShowroomStaffPinHash(staffId: string) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("showroom_staff")
    .select("id, full_name, pin_hash, active")
    .eq("id", staffId)
    .single();
  if (error) return null;
  return data;
}

export async function getDesignsForShowroom(): Promise<DesignWithVariants[]> {
  const supabase = createServiceRoleClient();
  return getDesigns(undefined, supabase);
}

function generatePoNo() {
  const now = new Date();
  const stamp = now.toISOString().slice(2, 10).replace(/-/g, "");
  const rand = Math.floor(Math.random() * 900 + 100);
  return `PO-SR-${stamp}-${rand}`;
}

export type ShowroomCartLine = {
  designId: string;
  design: DesignWithVariants;
  metalVariantId: string | null;
  diamondVariantId: string | null;
  colorstoneVariantId: string | null;
  quantity: number;
  price: number;
};

export async function placeShowroomOrder(
  staffName: string,
  customerName: string,
  lines: ShowroomCartLine[]
) {
  const supabase = createServiceRoleClient();
  const total = lines.reduce((sum, l) => sum + l.price, 0);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      po_no: generatePoNo(),
      status: "pending",
      showroom_staff_name: staffName,
      customer_name: customerName,
      total_amount: total,
      balance_amount: total,
      exp_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString().slice(0, 10),
    })
    .select()
    .single();
  if (orderError) throw orderError;

  const { error: itemsError } = await supabase.from("order_items").insert(
    lines.map((line) => {
      const metal = line.design.metalOptions.find((v) => v.id === line.metalVariantId);
      return {
        order_id: order.id,
        design_id: line.designId,
        design_no: line.design.sku,
        kt_col_label: metal?.label ?? null,
        size: "—",
        metal_variant_id: line.metalVariantId,
        diamond_variant_id: line.diamondVariantId,
        colorstone_variant_id: line.colorstoneVariantId,
        quantity: line.quantity,
        ordered_qty: line.quantity,
        finished_qty: 0,
        exported_qty: 0,
        balance_qty: line.quantity,
        remark: `Showroom sale — ${customerName}`,
        price: line.price,
      };
    })
  );
  if (itemsError) throw itemsError;

  return order;
}

export async function createShowroomCustomer(
  name: string,
  phone: string | undefined,
  email: string | undefined,
  staffName: string
) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("showroom_customers")
    .insert({
      name,
      phone: phone || null,
      email: email || null,
      created_by_staff_name: staffName,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
