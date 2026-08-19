import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { PhotoPlaceholder } from "@/components/brand/photo-placeholder";

const portals = [
  {
    href: "/business",
    eyebrow: "Explore designs and place orders",
    title: "Unique's Workspace",
    variant: "amber" as const,
  },
  {
    href: "/showroom",
    eyebrow: "Showroom sales & customer selection",
    title: "Unique's Store",
    variant: "noir" as const,
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-14 sm:py-20">
      <Logo className="mb-12 scale-125 sm:mb-16" />

      <div className="grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
        {portals.map((portal) => (
          <Link
            key={portal.href}
            href={portal.href}
            className="hover-lift group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl border border-border/50 p-8 shadow-lg sm:aspect-[3/4]"
          >
            <PhotoPlaceholder variant={portal.variant} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

            <div className="relative z-10 text-white">
              <p className="text-xs font-medium tracking-[0.16em] text-white/75 uppercase">
                {portal.eyebrow}
              </p>
              <h2 className="font-heading mt-2 text-4xl font-semibold sm:text-[2.75rem]">
                {portal.title}
              </h2>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/90 transition-transform duration-200 group-hover:translate-x-1">
                Enter Portal <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <p className="text-brand-brown/45 mt-14 text-xs">Estrella Jewels — B2B Ordering Portal</p>
    </div>
  );
}
