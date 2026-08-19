import Link from "next/link";
import { Truck, Gem, BookOpen, ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhotoPlaceholder } from "@/components/brand/photo-placeholder";

const quickActions = [
  {
    href: "/business/reports/order-history",
    icon: Truck,
    title: "Track Your Order",
    subtitle: "Check live status on orders in production",
  },
  {
    href: "/business/designs",
    icon: Gem,
    title: "My Designs",
    subtitle: "Browse the house archive and shortlist pieces",
  },
  {
    href: "/business/designs",
    icon: BookOpen,
    title: "E Catalogue",
    subtitle: "View the full Estrella collection",
  },
];

const supportingTiles = [
  {
    href: "/business/new-arrivals",
    label: "New Arrivals",
    caption: "Just landed in the house archive",
    variant: "cream" as const,
  },
  {
    href: "/business/designs",
    label: "Exclusive Designs",
    caption: "Limited pieces, made to order",
    variant: "cocoa" as const,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {quickActions.map(({ href, icon: Icon, title, subtitle }) => (
          <Link key={title} href={href}>
            <Card className="hover-lift h-full cursor-pointer">
              <div className="flex flex-col gap-3 px-5">
                <div className="bg-sidebar-active flex size-11 items-center justify-center rounded-full">
                  <Icon className="text-brand-brown size-5" />
                </div>
                <div>
                  <p className="font-heading text-lg font-semibold text-brand-brown">{title}</p>
                  <p className="text-brand-brown/60 mt-0.5 text-sm">{subtitle}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="relative isolate flex h-[420px] w-full overflow-hidden rounded-2xl border border-border/50 shadow-lg">
        <div className="animate-pan-right absolute inset-0">
          <PhotoPlaceholder variant="amber" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="relative z-10 flex max-w-lg flex-col justify-end gap-3 p-10 text-white">
          <p className="text-xs font-medium tracking-[0.16em] text-white/75 uppercase">
            The Autumn Edit
          </p>
          <h2 className="font-heading text-4xl font-semibold sm:text-5xl">
            Crafted for the discerning eye
          </h2>
          <p className="max-w-sm text-sm text-white/85">
            Explore this season&apos;s house designs, curated for retail partners
            ready to place their next order.
          </p>
          <Button asChild variant="accent" className="mt-2 w-fit">
            <Link href="/business/designs">
              Browse the collection <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {supportingTiles.map((tile) => (
          <Link
            key={tile.label}
            href={tile.href}
            className="hover-lift group relative isolate flex h-56 overflow-hidden rounded-2xl border border-border/50 shadow-md"
          >
            <PhotoPlaceholder variant={tile.variant} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="relative z-10 flex flex-1 flex-col justify-end p-6 text-white">
              <p className="font-heading text-2xl font-semibold">{tile.label}</p>
              <p className="mt-1 text-sm text-white/80">{tile.caption}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
