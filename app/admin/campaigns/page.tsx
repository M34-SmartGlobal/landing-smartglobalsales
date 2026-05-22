import { CampaignLogoManager } from "@/components/admin/campaign-logo-manager";
import { getAdminCampaigns } from "@/lib/actions/admin";

export default async function AdminCampaignsPage() {
  const campaigns = await getAdminCampaigns();

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-red">CMS ligero</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-brand-black">Campañas (Logos)</h2>
        <p className="mt-2 text-brand-muted">
          Administra exclusivamente los logos que aparecen en el carrusel infinito de marcas/campañas.
        </p>
      </div>
      <CampaignLogoManager initialCampaigns={campaigns} />
    </section>
  );
}
