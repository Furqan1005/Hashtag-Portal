import { NextResponse } from "next/server";

import { getCurrentShowroomStaff } from "@/lib/auth/showroom-current";
import { createShowroomCustomer } from "@/lib/data/showroom";

export async function POST(request: Request) {
  const session = await getCurrentShowroomStaff();
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { name, phone, email } = (await request.json()) as {
    name?: string;
    phone?: string;
    email?: string;
  };
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const customer = await createShowroomCustomer(name, phone, email, session.staffName);
  return NextResponse.json({ ok: true, customer });
}
