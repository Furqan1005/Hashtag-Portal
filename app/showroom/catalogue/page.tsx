import { redirect } from "next/navigation";

import { getCurrentShowroomStaff } from "@/lib/auth/showroom-current";
import { getDesignsForShowroom } from "@/lib/data/showroom";
import { ShowroomHeader } from "@/components/showroom/showroom-header";
import { PhotoPlaceholder } from "@/components/brand/photo-placeholder";
import { formatWeight } from "@/lib/weight-format";

export default async function ShowroomCataloguePage() {
  const session = await getCurrentShowroomStaff();
  if (!session) redirect("/showroom");

  const designs = await getDesignsForShowroom();

  return (
    <div className="flex min-h-screen flex-col">
      <ShowroomHeader staffName={session.staffName} />
      <main className="flex-1 px-6 pb-16 sm:px-10">
        <div className="mb-6">
          <p className="font-heading text-3xl font-semibold text-brand-brown">E Catalogue</p>
          <p className="text-brand-brown/60 mt-1 text-sm">
            Showcase the full house collection to your customer.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {designs.map((design) => (
            <div
              key={design.id}
              className="hover-lift card-surface overflow-hidden rounded-xl border border-border/60"
            >
              <div className="relative aspect-square w-full">
                <PhotoPlaceholder variant="cream" />
              </div>
              <div className="p-4">
                <p className="text-brand-brown text-sm font-semibold">{design.sku}</p>
                <p className="text-brand-brown/55 text-xs capitalize">{design.category}</p>
                <p className="text-brand-brown/45 mt-1 text-xs">
                  {formatWeight(design.base_weight_gms, "gms")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
