import { NextResponse } from "next/server";

const DEMO_COOKIE = "estrella_demo_session";

function createDemoResponse(next: string | null, origin?: string) {
  const response = next
    ? NextResponse.redirect(new URL(next, origin ?? "http://localhost:3000"))
    : NextResponse.json({ ok: true });
  response.cookies.set(DEMO_COOKIE, "enabled", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}

export async function GET(request: Request) {
  const next = new URL(request.url).searchParams.get("next");
  return createDemoResponse(next, new URL(request.url).origin);
}

export async function POST() {
  return createDemoResponse(null);
}
