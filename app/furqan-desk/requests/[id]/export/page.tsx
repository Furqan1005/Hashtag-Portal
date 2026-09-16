import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ExportPanel } from "@/components/furqan-desk/export-panel";
import { getPricing, getRequest } from "@/lib/furqan-desk/mock-data";

export default async function RequestExportPage({
  params,
}: PageProps<"/furqan-desk/requests/[id]/export">) {
  const { id } = await params;
  const request = getRequest(id);
  if (!request) notFound();

  return (
    <div className="flex flex-col gap-6 pt-2">
      <div>
        <Link
          href={`/furqan-desk/requests/${request.id}`}
          className="text-brand-brown/55 hover:text-brand-brown inline-flex items-center gap-1 text-sm font-medium"
        >
          <ArrowLeft className="size-3.5" /> Back to Order Workspace
        </Link>
        <h1 className="font-heading mt-3 text-4xl font-semibold text-brand-brown">Export / Final Output</h1>
        <p className="text-brand-brown/60 mt-1.5 max-w-xl text-sm">{request.customer} · {request.subject}</p>
      </div>

      <ExportPanel request={request} currencyCode={getPricing(request.customer)?.currency ?? "INR"} />
    </div>
  );
}
