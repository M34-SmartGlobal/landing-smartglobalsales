import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { PageTransition } from "@/components/page-transition";
import { requireAdminUser } from "@/lib/actions/admin";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireAdminUser();

  return (
    <div className="min-h-screen bg-brand-canvas text-brand-graphite lg:grid lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      <div className="min-w-0">
        <AdminHeader email={user.email} />
        <main className="p-4 sm:p-6 lg:p-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
