import { JobsManager } from "@/components/admin/jobs-manager";
import { getAdminJobPositions } from "@/lib/actions/admin";

export default async function AdminJobsPage() {
  const jobs = await getAdminJobPositions();

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-red">Postulaciones</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-brand-black">Puestos de trabajo</h2>
        <p className="mt-2 text-brand-muted">
          Crea puestos como Comercial, Asistente TI o nuevas vacantes para el formulario público.
        </p>
      </div>
      <JobsManager initialJobs={jobs} />
    </section>
  );
}
