import { getDesigns } from "@/lib/data/designs";
import { getActiveSelectionDesignIds, getSelectionCount } from "@/lib/data/selections";
import { NewArrivalsClient } from "@/components/business/designs/new-arrivals-client";

export default async function NewArrivalsPage() {
  const [designs, selectedIds, selectionCount] = await Promise.all([
    getDesigns({ isNewArrival: true }),
    getActiveSelectionDesignIds(),
    getSelectionCount(),
  ]);

  return (
    <NewArrivalsClient
      designs={designs}
      initialSelectedDesignIds={selectedIds}
      initialSelectionCount={selectionCount}
    />
  );
}
