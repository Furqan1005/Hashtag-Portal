import { ExceptionsClient } from "@/components/furqan-desk/exceptions-client";

export default function ExceptionsPage() {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div>
        <h1 className="font-heading text-4xl font-semibold text-brand-brown">Exceptions</h1>
        <p className="text-brand-brown/60 mt-1.5 max-w-2xl text-sm">
          Cases where AI could not confidently proceed on its own — design matches, pricing lookups
          and ambiguous terminology, all routed here for a human decision.
        </p>
      </div>

      <ExceptionsClient />
    </div>
  );
}
