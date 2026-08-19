"use client";

import Link from "next/link";
import { User, Settings, ArrowLeftRight, LogOut, Store, ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "@/lib/auth/actions";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function AccountDropdown({
  fullName,
  email,
  avatarUrl,
}: {
  fullName: string;
  email: string | null;
  avatarUrl: string | null;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-full py-1 pr-2 pl-1 transition-colors hover:bg-brand-brown/8 focus:outline-none">
        <Avatar>
          {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} />}
          <AvatarFallback>{initials(fullName) || "U"}</AvatarFallback>
        </Avatar>
        <div className="hidden text-left leading-tight sm:block">
          <p className="text-sm font-medium text-brand-brown">{fullName}</p>
          {email && <p className="text-brand-brown/55 text-xs">{email}</p>}
        </div>
        <ChevronDown className="text-brand-brown/50 size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/business/profile">
            <User /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/business/settings">
            <Settings /> Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Switch Portal</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/">
            <ArrowLeftRight /> Portal Selector
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/showroom">
            <Store /> Showroom Portal
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={(e) => {
            e.preventDefault();
            signOut();
          }}
        >
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
