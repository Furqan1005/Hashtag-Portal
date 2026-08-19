import { NextResponse } from "next/server";

const DEMO_COOKIE = "estrella_demo_session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(DEMO_COOKIE, "enabled", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
