import { redirect } from "next/navigation";

import { getCurrentShowroomStaff } from "@/lib/auth/showroom-current";
import { getDesignsForShowroom } from "@/lib/data/showroom";
import { ShowroomHeader } from "@/components/showroom/showroom-header";
import { ShowroomDesignsClient } from "@/components/showroom/showroom-designs-client";

export default async function ShowroomDesignsPage({
  searchParams,
}: {
  searchParams: Promise<{ customer?: string }>;
}) {
  const session = await getCurrentShowroomStaff();
  if (!session) redirect("/showroom");

  const { customer } = await searchParams;
  const designs = await getDesignsForShowroom();

  return (
    <div className="flex min-h-screen flex-col">
      <ShowroomHeader staffName={session.staffName} />
      <main className="flex-1 px-6 pb-24 sm:px-10">
        <div className="mb-6">
          <p className="font-heading text-3xl font-semibold text-brand-brown">My Designs</p>
          <p className="text-brand-brown/60 mt-1 text-sm">
            Browse the archive with your customer and build their selection.
          </p>
        </div>
        <ShowroomDesignsClient
          designs={designs}
          staffName={session.staffName}
          initialCustomerName={customer ?? ""}
        />
      </main>
    </div>
  );
}
