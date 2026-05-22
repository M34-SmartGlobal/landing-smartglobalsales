import { LegalEditor } from "@/components/admin/legal-editor";
import { getAdminLegalContents } from "@/lib/actions/admin";

export default async function AdminLegalPage() {
  const legalContents = await getAdminLegalContents();

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-red">Contenido legal</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-brand-black">Textos legales</h2>
        <p className="mt-2 text-brand-muted">
          Actualiza políticas, términos y consentimiento sin redesplegar la landing.
        </p>
      </div>
      <LegalEditor initialContents={legalContents} />
    </section>
  );
}
