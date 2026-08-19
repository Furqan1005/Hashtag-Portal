import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getShowroomStaffPinHash } from "@/lib/data/showroom";
import { verifyPin } from "@/lib/auth/pin";
import { createShowroomSessionCookie } from "@/lib/auth/showroom-session";

export async function POST(request: Request) {
  const { staffId, pin } = (await request.json()) as { staffId?: string; pin?: string };

  if (!staffId || !pin) {
    return NextResponse.json({ error: "Missing staff or PIN" }, { status: 400 });
  }

  const staff = await getShowroomStaffPinHash(staffId);
  if (!staff || !staff.active) {
    return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
  }

  const valid = await verifyPin(pin, staff.pin_hash);
  if (!valid) {
    return NextResponse.json({ error: "Incorrect PIN" }, { status: 401 });
  }

  const cookie = await createShowroomSessionCookie(staff.id, staff.full_name);
  const cookieStore = await cookies();
  cookieStore.set(cookie.name, cookie.value, cookie.options);

  return NextResponse.json({ ok: true, staffName: staff.full_name });
}
