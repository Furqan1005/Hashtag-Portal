import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { SHOWROOM_COOKIE_NAME } from "@/lib/auth/showroom-session";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(SHOWROOM_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
