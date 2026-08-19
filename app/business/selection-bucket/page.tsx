import { getSelectionItems } from "@/lib/data/selections";
import { SelectionBucketClient } from "@/components/business/selection/selection-bucket-client";

export default async function SelectionBucketPage() {
  const items = await getSelectionItems("active");

  return <SelectionBucketClient items={items} />;
}
