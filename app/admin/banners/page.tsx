import { BannerManager } from "@/components/admin/banner-manager";
import { getAdminBanners } from "@/lib/actions/admin";

export default async function AdminBannersPage() {
  const banners = await getAdminBanners();

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-red">Hero visual</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-brand-black">Banners / Hero</h2>
        <p className="mt-2 text-brand-muted">
          Gestiona imágenes de equipo, títulos y descripciones que aparecen en la landing.
        </p>
      </div>
      <BannerManager initialBanners={banners} />
    </section>
  );
}
