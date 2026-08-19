import Image from "next/image";

import { cn } from "@/lib/utils";

const VARIANTS = {
  amber: "from-[#c6a480] via-[#a97e56] to-[#543214]",
  cocoa: "from-[#8a6440] via-[#5f3d1f] to-[#2a1608]",
  cream: "from-[#ecdfc9] via-[#c6a480] to-[#7a5330]",
  noir: "from-[#54321a] via-[#2c1a0d] to-[#000000]",
} as const;

/**
 * Faceted-diamond gradient standing in for real house photography until
 * the client supplies actual campaign/product shots (served from Supabase
 * Storage via `src`, at which point this renders next/image instead).
 */
export function PhotoPlaceholder({
  src,
  alt = "",
  variant = "amber",
  className,
}: {
  src?: string | null;
  alt?: string;
  variant?: keyof typeof VARIANTS;
  className?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={cn("object-cover", className)}
        sizes="100vw"
      />
    );
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <div className={cn("absolute inset-0 bg-gradient-to-br", VARIANTS[variant])} />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.14] mix-blend-overlay"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 400 400"
      >
        <defs>
          <pattern id={`facets-${variant}`} width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M50 0 L100 35 L82 100 L18 100 L0 35 Z" fill="none" stroke="white" strokeWidth="0.75" />
            <path d="M50 0 L50 100 M0 35 L100 35 M18 100 L50 55 L82 100" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="400" fill={`url(#facets-${variant})`} />
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_20%_0%,rgba(255,255,255,0.18),transparent_55%)]" />
    </div>
  );
}
