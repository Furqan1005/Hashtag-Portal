import { getSelectionItems } from "@/lib/data/selections";
import { PlaceFinalOrderClient } from "@/components/business/selection/place-final-order-client";

export default async function PlaceFinalOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ items?: string }>;
}) {
  const params = await searchParams;
  const ids = params.items?.split(",").filter(Boolean) ?? [];
  const allActive = await getSelectionItems("active");
  const items = allActive.filter((i) => ids.includes(i.id));

  return <PlaceFinalOrderClient items={items} />;
}
