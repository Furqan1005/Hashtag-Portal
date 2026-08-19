import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/types/database.types";

export type Profile = Tables<"profiles">;

export async function getCurrentProfile(): Promise<Profile | null> {
  const cookieStore = await cookies();
  if (cookieStore.get("estrella_demo_session")?.value === "enabled") {
    return {
      id: "00000000-0000-0000-0000-000000000001",
      account_id: null,
      avatar_url: null,
      created_at: new Date(0).toISOString(),
      email: "demo@estrella.local",
      full_name: "Demo Portal User",
      role: "business_owner",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}

export async function requireProfile(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/auth/login");
  return profile;
}
