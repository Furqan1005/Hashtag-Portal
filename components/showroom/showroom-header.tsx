"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export function ShowroomHeader({ staffName }: { staffName?: string }) {
  const router = useRouter();

  async function handleExit() {
    await fetch("/api/showroom/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <header className="flex items-center justify-between px-8 py-6 sm:px-10">
      <Link href="/showroom/floor">
        <Logo />
      </Link>
      <div className="flex items-center gap-4">
        {staffName && <p className="text-brand-brown/60 text-sm">Signed in as {staffName}</p>}
        <Button variant="outline" size="sm" onClick={handleExit}>
          <LogOut className="size-4" /> Exit Showroom
        </Button>
      </div>
    </header>
  );
}
