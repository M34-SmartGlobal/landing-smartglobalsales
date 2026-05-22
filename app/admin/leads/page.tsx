import { LeadsTable } from "@/components/admin/leads-table";
import { getAdminLeads } from "@/lib/actions/admin";

export default async function AdminLeadsPage() {
  const leads = await getAdminLeads();

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-red">Mini CRM</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-brand-black">Gestor de leads</h2>
        <p className="mt-2 text-brand-muted">
          Visualiza postulaciones y contactos entrantes. Exporta datos filtrados a CSV para seguimiento.
        </p>
      </div>
      <LeadsTable applications={leads.applications} contacts={leads.contacts} />
    </section>
  );
}
