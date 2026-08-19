import { cookies } from "next/headers";

import { SHOWROOM_COOKIE_NAME, verifyShowroomSessionValue } from "@/lib/auth/showroom-session";

export async function getCurrentShowroomStaff() {
  const cookieStore = await cookies();
  const session = await verifyShowroomSessionValue(cookieStore.get(SHOWROOM_COOKIE_NAME)?.value);
  return session;
}
