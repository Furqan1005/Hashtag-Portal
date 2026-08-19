import { getSelectionItems } from "@/lib/data/selections";
import { SavedClient } from "@/components/business/selection/saved-client";

export default async function SavedPage() {
  const items = await getSelectionItems("saved");

  return <SavedClient items={items} />;
}
