import { LocationsManager } from "@/components/admin/locations-manager";
import { getAdminLocations } from "@/lib/actions/admin";

export default async function AdminLocationsPage() {
  const locations = await getAdminLocations();

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-red">Operación</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-brand-black">Sedes</h2>
        <p className="mt-2 text-brand-muted">
          Crea, edita y activa/desactiva sedes disponibles en el formulario de postulación.
        </p>
      </div>
      <LocationsManager initialLocations={locations} />
    </section>
  );
}
