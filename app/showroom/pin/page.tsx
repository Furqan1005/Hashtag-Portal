"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Delete } from "lucide-react";
import { toast } from "sonner";

import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

const PIN_LENGTH = 4;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

function PinEntry() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const staffId = searchParams.get("staff") ?? "";
  const name = searchParams.get("name") ?? "";

  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [verifying, setVerifying] = useState(false);

  async function submitPin(value: string) {
    setVerifying(true);
    const res = await fetch("/api/showroom/verify-pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staffId, pin: value }),
    });
    setVerifying(false);

    if (res.ok) {
      router.push("/showroom/floor");
      return;
    }
    setError(true);
    setPin("");
    toast.error("Incorrect PIN, try again");
  }

  function handleKey(key: string) {
    if (verifying) return;
    setError(false);
    if (key === "back") {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (key === "" || pin.length >= PIN_LENGTH) return;
    const next = pin + key;
    setPin(next);
    if (next.length === PIN_LENGTH) submitPin(next);
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-16">
      <Logo className="mb-6" />
      <p className="font-heading text-3xl font-semibold text-brand-brown">
        {name ? `Hi, ${name}` : "Enter your PIN"}
      </p>
      <p className="text-brand-brown/60 mt-1 text-sm">Enter your 4-digit PIN to continue.</p>

      <div className="mt-8 flex gap-3">
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "size-3.5 rounded-full border transition-colors duration-150",
              i < pin.length
                ? error
                  ? "bg-destructive border-destructive"
                  : "bg-accent border-accent"
                : "border-brand-brown/25"
            )}
          />
        ))}
      </div>

      <div className="mt-10 grid w-full max-w-xs grid-cols-3 gap-3">
        {KEYS.map((key, i) =>
          key === "" ? (
            <div key={i} />
          ) : (
            <button
              key={i}
              onClick={() => handleKey(key)}
              disabled={verifying}
              className="hover-lift card-surface flex h-16 items-center justify-center rounded-xl border border-border/60 text-xl font-medium text-brand-brown shadow-sm disabled:opacity-50"
            >
              {key === "back" ? <Delete className="size-5" /> : key}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default function ShowroomPinPage() {
  return (
    <Suspense>
      <PinEntry />
    </Suspense>
  );
}
