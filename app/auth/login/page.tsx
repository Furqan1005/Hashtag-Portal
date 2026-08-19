"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/brand/logo";

function LoginForm() {

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md p-2">
        <CardContent className="flex flex-col gap-6 pt-2">
          <div className="flex flex-col items-center gap-2 text-center">
            <Logo />
            <p className="font-heading mt-2 text-2xl font-semibold text-brand-brown">
              Welcome to Estrella
            </p>
            <p className="text-brand-brown/60 text-sm">
              Enter the business or showroom portal
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild className="mt-2 w-full">
              <Link href="/auth/demo-login?next=%2Fbusiness%2Fdashboard">Sign in</Link>
            </Button>
            <p className="text-brand-brown/50 text-center text-xs">
              Demo access is enabled for this portal preview.
            </p>
          </div>

          <Link
            href="/"
            className="text-brand-brown/50 text-center text-xs hover:text-brand-brown"
          >
            ← Back to portal selector
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
