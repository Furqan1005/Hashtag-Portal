import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("size-8", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 3 L33 14 L20 37 L7 14 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M7 14 L33 14 M13.5 14 L20 3 L26.5 14 M13.5 14 L20 37 M26.5 14 L20 37"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
  wordmarkClassName,
  tone = "brown",
}: {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  tone?: "brown" | "white";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5",
        tone === "brown" ? "text-brand-brown" : "text-brand-white",
        className
      )}
    >
      <LogoMark className={markClassName} />
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading text-lg font-semibold tracking-[0.14em]",
            wordmarkClassName
          )}
        >
          ESTRELLA
        </span>
        <span className="text-[10px] font-medium tracking-[0.35em] opacity-70">
          JEWELS
        </span>
      </div>
    </div>
  );
}
