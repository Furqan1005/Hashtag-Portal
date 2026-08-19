import { requireProfile } from "@/lib/auth/current-user";
import { Sidebar } from "@/components/business/sidebar";
import { Topbar } from "@/components/business/topbar";

export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Topbar
          fullName={profile.full_name || "there"}
          email={profile.email}
          avatarUrl={profile.avatar_url}
        />
        <main className="px-8 pb-16 sm:px-10">{children}</main>
      </div>
    </div>
  );
}
