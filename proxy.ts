import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";
import { verifyShowroomSessionValue, SHOWROOM_COOKIE_NAME } from "@/lib/auth/showroom-session";

const SHOWROOM_PUBLIC_PATHS = ["/showroom", "/showroom/pin"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Showroom Portal: gated by its own signed cookie, never Supabase Auth.
  // Only view + order-on-behalf-of routes exist under /showroom — there is
  // no pricing, reports, or settings route to accidentally expose.
  if (pathname.startsWith("/showroom")) {
    if (SHOWROOM_PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
      if (pathname.startsWith("/showroom/pin")) return NextResponse.next();
      if (pathname === "/showroom") return NextResponse.next();
    }

    const session = await verifyShowroomSessionValue(
      request.cookies.get(SHOWROOM_COOKIE_NAME)?.value
    );
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/showroom";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Business Portal: standard Supabase Auth session.
  if (pathname.startsWith("/business")) {
    const { supabaseResponse, user } = await updateSession(request);
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/business/:path*", "/showroom/:path*"],
};
