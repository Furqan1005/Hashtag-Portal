import { NextResponse, type NextRequest } from "next/server";

export async function proxy(_request: NextRequest) {
  // Demo preview mode: portal pages are browseable without credentials.
  // Restore the Supabase session guard here when production auth is enabled.
  return NextResponse.next();
}

export const config = {
  matcher: ["/business/:path*", "/showroom/:path*"],
};
