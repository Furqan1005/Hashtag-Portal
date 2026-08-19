import { NextResponse } from "next/server";

import { getCurrentShowroomStaff } from "@/lib/auth/showroom-current";
import { placeShowroomOrder, getDesignsForShowroom, type ShowroomCartLine } from "@/lib/data/showroom";

type CartLinePayload = {
  designId: string;
  metalVariantId: string | null;
  diamondVariantId: string | null;
  colorstoneVariantId: string | null;
  quantity: number;
};

export async function POST(request: Request) {
  const session = await getCurrentShowroomStaff();
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { customerName, lines } = (await request.json()) as {
    customerName?: string;
    lines?: CartLinePayload[];
  };

  if (!customerName || !lines?.length) {
    return NextResponse.json({ error: "Missing customer or items" }, { status: 400 });
  }

  const designs = await getDesignsForShowroom();

  const resolvedLines: ShowroomCartLine[] = lines.map((line) => {
    const design = designs.find((d) => d.id === line.designId);
    if (!design) throw new Error("Unknown design");
    const metal = design.metalOptions.find((v) => v.id === line.metalVariantId);
    const diamond = design.diamondOptions.find((v) => v.id === line.diamondVariantId);
    const colorstone = design.colorstoneOptions.find((v) => v.id === line.colorstoneVariantId);
    const price =
      (design.base_price +
        (metal?.price_modifier ?? 0) +
        (diamond?.price_modifier ?? 0) +
        (colorstone?.price_modifier ?? 0)) *
      line.quantity;

    return {
      designId: line.designId,
      design,
      metalVariantId: line.metalVariantId,
      diamondVariantId: line.diamondVariantId,
      colorstoneVariantId: line.colorstoneVariantId,
      quantity: line.quantity,
      price,
    };
  });

  const order = await placeShowroomOrder(session.staffName, customerName, resolvedLines);
  return NextResponse.json({ ok: true, poNo: order.po_no });
}
