import Link from "next/link";

import { Logo } from "@/components/brand/logo";

// Staff roster can change without a redeploy, and this page needs the
// service-role client — never prerender it statically.
export const dynamic = "force-dynamic";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getShowroomStaffRoster } from "@/lib/data/showroom";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default async function ShowroomProfileSelectPage() {
  const staff = await getShowroomStaffRoster();

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-16">
      <Logo className="mb-3" />
      <p className="font-heading mt-6 text-3xl font-semibold text-brand-brown">
        Who&apos;s working the floor?
      </p>
      <p className="text-brand-brown/60 mt-1 text-sm">Select your profile to continue.</p>

      <div className="mt-10 grid w-full max-w-2xl grid-cols-2 gap-5 sm:grid-cols-3">
        {staff.map((member) => (
          <Link
            key={member.id}
            href={`/showroom/pin?staff=${member.id}&name=${encodeURIComponent(member.full_name)}`}
            className="hover-lift card-surface flex flex-col items-center gap-3 rounded-2xl border border-border/60 px-4 py-6 text-center shadow-sm"
          >
            <Avatar className="size-16">
              {member.avatar_url && <AvatarImage src={member.avatar_url} alt={member.full_name} />}
              <AvatarFallback className="text-lg">{initials(member.full_name)}</AvatarFallback>
            </Avatar>
            <p className="text-brand-brown text-sm font-semibold">{member.full_name}</p>
          </Link>
        ))}
      </div>

      <Link href="/" className="text-brand-brown/50 hover:text-brand-brown mt-12 text-xs">
        ← Back to portal selector
      </Link>
    </div>
  );
}
