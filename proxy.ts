import { NextResponse, type NextRequest } from "next/server";

export async function proxy(_request: NextRequest) {
  // This preview is intentionally browseable without credentials so the full
  // business and showroom portals can be reviewed from the Sign in button.
  return NextResponse.next();
}

export const config = {
  matcher: ["/business/:path*", "/showroom/:path*"],
};
