"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ShowroomHeader } from "@/components/showroom/showroom-header";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewCustomerPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/showroom/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email }),
    });
    setLoading(false);

    if (!res.ok) {
      toast.error("Couldn't save this customer");
      return;
    }
    toast.success(`${name} added — let's find them something`);
    router.push(`/showroom/designs?customer=${encodeURIComponent(name)}`);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ShowroomHeader />
      <main className="flex flex-1 items-start justify-center px-6 py-10">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col gap-5">
            <div>
              <p className="font-heading text-2xl font-semibold text-brand-brown">New Customer</p>
              <p className="text-brand-brown/60 mt-1 text-sm">
                Log this customer before browsing designs together.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading} className="mt-2">
                Continue to Designs
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
