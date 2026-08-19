import { redirect } from "next/navigation";
import Link from "next/link";
import { Gem, BookOpen, UserPlus } from "lucide-react";

import { getCurrentShowroomStaff } from "@/lib/auth/showroom-current";
import { ShowroomHeader } from "@/components/showroom/showroom-header";
import { PhotoPlaceholder } from "@/components/brand/photo-placeholder";

export default async function ShowroomFloorPage() {
  const session = await getCurrentShowroomStaff();
  if (!session) redirect("/showroom");

  return (
    <div className="flex min-h-screen flex-col">
      <ShowroomHeader staffName={session.staffName} />

      <main className="flex flex-1 flex-col items-center px-6 pt-8 pb-20">
        <p className="font-heading text-4xl font-semibold text-brand-brown">
          Welcome, {session.staffName}
        </p>
        <p className="text-brand-brown/60 mt-2 text-sm">
          Where would you like to take your customer?
        </p>

        <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
          <Link
            href="/showroom/designs"
            className="hover-lift group relative isolate flex h-64 overflow-hidden rounded-2xl border border-border/50 shadow-lg"
          >
            <PhotoPlaceholder variant="amber" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="relative z-10 flex flex-1 flex-col justify-end p-6 text-white">
              <Gem className="mb-2 size-6" />
              <p className="font-heading text-2xl font-semibold">My Designs</p>
              <p className="mt-1 text-sm text-white/80">
                Browse and select pieces with your customer
              </p>
            </div>
          </Link>

          <Link
            href="/showroom/catalogue"
            className="hover-lift group relative isolate flex h-64 overflow-hidden rounded-2xl border border-border/50 shadow-lg"
          >
            <PhotoPlaceholder variant="cocoa" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="relative z-10 flex flex-1 flex-col justify-end p-6 text-white">
              <BookOpen className="mb-2 size-6" />
              <p className="font-heading text-2xl font-semibold">E Catalogue</p>
              <p className="mt-1 text-sm text-white/80">Showcase the full house collection</p>
            </div>
          </Link>
        </div>

        <Link
          href="/showroom/customers/new"
          className="hover-lift card-surface mt-6 flex w-full max-w-3xl items-center gap-3 rounded-xl border border-border/60 px-5 py-4 shadow-sm"
        >
          <div className="bg-sidebar-active flex size-10 items-center justify-center rounded-full">
            <UserPlus className="text-brand-brown size-5" />
          </div>
          <div>
            <p className="text-brand-brown text-sm font-semibold">New Customer</p>
            <p className="text-brand-brown/55 text-xs">Log a walk-in customer for this visit</p>
          </div>
        </Link>
      </main>
    </div>
  );
}
