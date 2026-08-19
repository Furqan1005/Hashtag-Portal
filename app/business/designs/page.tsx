import { getDesigns } from "@/lib/data/designs";
import { getActiveSelectionDesignIds, getSelectionCount } from "@/lib/data/selections";
import { DesignGalleryClient } from "@/components/business/designs/design-gallery-client";

export default async function DesignsPage() {
  const [designs, selectedIds, selectionCount] = await Promise.all([
    getDesigns(),
    getActiveSelectionDesignIds(),
    getSelectionCount(),
  ]);

  return (
    <DesignGalleryClient
      designs={designs}
      initialSelectedDesignIds={selectedIds}
      initialSelectionCount={selectionCount}
    />
  );
}
