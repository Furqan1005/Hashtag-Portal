"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/brand/logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/business/dashboard";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDemoSignIn() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/auth/demo-login", { method: "POST" });
      if (!response.ok) throw new Error("Unable to open the demo portal.");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to open the demo portal.");
      setLoading(false);
    }
  }

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
            {error && <p className="text-destructive text-center text-sm">{error}</p>}
            <Button
              type="button"
              disabled={loading}
              onClick={handleDemoSignIn}
              className="mt-2 w-full"
            >
              {loading && <Loader2 className="animate-spin" />}
              {loading ? "Opening portal..." : "Sign in"}
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
