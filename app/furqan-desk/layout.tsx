import { Poppins } from "next/font/google";

import { FurqanSidebar } from "@/components/furqan-desk/sidebar";

// Avenir (Estrella's real brand typeface) isn't a licensable web font.
// Poppins is the closest freely-available geometric sans as a stand-in —
// swap this for a self-hosted Avenir @font-face if/when the license is available.
const avenir = Poppins({
  variable: "--font-avenir",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function FurqanDeskLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`autopilot-theme ${avenir.variable} flex min-h-screen`}>
      <FurqanSidebar />
      <div className="flex-1">
        <main className="px-8 py-8 sm:px-10">
          <div className="mb-6 rounded-xl border border-warning/30 bg-warning/10 px-4 py-2.5 text-xs font-medium text-brand-brown/80">
            Prototype / demo only — mock data throughout. Not connected to JEMR, CRM, Zoho, or any live pricing/order system.
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
