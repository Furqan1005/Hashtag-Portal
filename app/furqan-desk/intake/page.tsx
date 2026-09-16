import { EmailIntakeClient } from "@/components/furqan-desk/email-intake-client";

export default function EmailIntakePage() {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div>
        <h1 className="font-heading text-4xl font-semibold text-brand-brown">Email Intake</h1>
        <p className="text-brand-brown/60 mt-1.5 max-w-2xl text-sm">
          Attach a real customer email and watch it move through every step — extraction, design
          matching, pricing, and human verification — before anything is finalized.
        </p>
      </div>

      <EmailIntakeClient />
    </div>
  );
}
