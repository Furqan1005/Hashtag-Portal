import { notFound } from "next/navigation";

import { OrderWorkspace } from "@/components/furqan-desk/order-workspace";
import { getKnowledge, getPricing, getRequest } from "@/lib/furqan-desk/mock-data";

export default async function RequestWorkspacePage({
  params,
}: PageProps<"/furqan-desk/requests/[id]">) {
  const { id } = await params;
  const request = getRequest(id);
  if (!request) notFound();

  return (
    <OrderWorkspace
      request={request}
      pricing={getPricing(request.customer)}
      knowledge={getKnowledge(request.customer)}
    />
  );
}
